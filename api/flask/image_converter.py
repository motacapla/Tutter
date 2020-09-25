import numpy as np
import cv2
import matplotlib.pyplot as plt
import os
import config
import math
import requests

def resize_img(img):
    img_height, img_width = img.shape[:2]
    long_side_size = min(600, max(img_height, img_width))
    if img_height < img_width:        
        scale = img_width / long_side_size
        size = (long_side_size, math.ceil(img_height / scale))
    else:
        scale = img_height / long_side_size
        size = (math.ceil(img_width / scale), long_side_size)
    return cv2.resize(img, size, interpolation=cv2.INTER_CUBIC)    

def call_remove_bg_api(dt_now, path):
    response = requests.post(
        'https://api.remove.bg/v1.0/removebg',
        files = {'image_file': open(path, 'rb')},
        data = {'size': 'auto'},
        headers = {'X-Api-Key': config.REMOVE_BG_KEY},
    )
    
    filepath = os.path.join(config.UPLOAD_FOLDER, "no_bg_" + dt_now + ".png")
    with open(filepath, 'wb') as out:
        out.write(response.content)
        
    return filepath

def background_eliminate(img):
    BLUR = 21
    CANNY_THRESH_1 = 10
    CANNY_THRESH_2 = 200
    MASK_DILATE_ITER = 10
    MASK_ERODE_ITER = 10
    MASK_COLOR = (0.0,0.0,1.0)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    edges = cv2.Canny(gray, CANNY_THRESH_1, CANNY_THRESH_2)
    edges = cv2.dilate(edges, None)
    edges = cv2.erode(edges, None)

    contour_info = []
    contours, _ = cv2.findContours(edges, cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)
    for c in contours:
        contour_info.append((
            c,
            cv2.isContourConvex(c),
            cv2.contourArea(c),
        ))
    contour_info = sorted(contour_info, key=lambda c: c[2], reverse=True)
    max_contour = contour_info[0]

    mask = np.zeros(edges.shape)
    cv2.fillConvexPoly(mask, max_contour[0], (255))

    mask = cv2.dilate(mask, None, iterations=MASK_DILATE_ITER)
    mask = cv2.erode(mask, None, iterations=MASK_ERODE_ITER)
    mask = cv2.GaussianBlur(mask, (BLUR, BLUR), 0)
    mask_stack = np.dstack([mask]*3)    # Create 3-channel alpha mask

    mask_stack  = mask_stack.astype('float32') / 255.0          # Use float matrices, 
    img         = img.astype('float32') / 255.0                 #  for easy blending

    masked = (mask_stack * img) + ((1-mask_stack) * MASK_COLOR) # Blend
    masked = (masked * 255).astype('uint8')                     # Convert back to 8-bit 

    c_blue, c_green, c_red = cv2.split(img)

    img_a = cv2.merge((c_red, c_green, c_blue, mask.astype('float32') / 255.0))
    return img_a

"""

def background_eliminate_type0(img):
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = img[...,::-1] 
    h,w,_ = img.shape
    img = cv2.resize(img,(320,320))
    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    model = torchvision.models.segmentation.deeplabv3_resnet101(pretrained=True)
    model = model.to(device)
    model.eval()
    
    preprocess = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    input_tensor = preprocess(img)
    input_batch = input_tensor.unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(input_batch)['out'][0]
    output = output.argmax(0)
    mask = output.byte().cpu().numpy()
    mask = cv2.resize(mask,(w,h))
    img = cv2.resize(img,(w,h))

    print("created mask")

    return apply_mask_to_img(img, mask)
"""

# おそすぎるのでこいつ直して
def apply_mask_to_img(img, mask):
    mylist = [(x, y) for x in range(len(mask)) for y in range(len(mask[0]))]

    for x, y in mylist:
        if (mask[x, y] == 0):
            img[x, y, 0] = 255
            img[x, y, 1] = 255
            img[x, y, 2] = 255

    return img