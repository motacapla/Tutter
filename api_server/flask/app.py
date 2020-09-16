import os
import cv2
import random
import string
import numpy as np
from flask import Flask, request, redirect, url_for, send_from_directory, render_template, session
from flask_cors import CORS
from werkzeug.utils import secure_filename
from datetime import datetime
from image_process import canny
from image_converter import background_eliminate, background_eliminate_type0
from post_twitter import post_with_large_file

UPLOAD_FOLDER = './uploads'

if not os.path.isdir(UPLOAD_FOLDER):
    os.mkdir(UPLOAD_FOLDER)

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = "".join([random.choice(string.ascii_letters + string.digits + '_' + '-' + '!' + '#' + '&')
                          for i in range(64)])
CORS(app, supports_credentials=True)

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'gif'])

def random_str(n):
    return ''.join([random.choice(string.ascii_letters + string.digits) for i in range(n)])

@app.route("/v1/image", methods = ["POST"])
def upload():
    if request.files['file']:
        stream = request.files['file'].stream
        img_array = np.asarray(bytearray(stream.read()), dtype=np.uint8)
        img = cv2.imdecode(img_array, 1)

        # TODO : I NEED SOME HELP!
        #img = canny(img)
        #img = background_eliminate_type0(img)

        dt_now = datetime.now().strftime("%Y_%m_%H_%M_%S_") + random_str(5)
        save_path = os.path.join(UPLOAD_FOLDER, dt_now + ".png")
        cv2.imwrite(save_path, img)

        print("save", save_path)

        response = {
            "filename": dt_now + ".png"
        }
        return response

@app.route('/v1/image/<path:path>', methods = ["GET"])
def uploaded_file(path):
    return send_from_directory(app.config['UPLOAD_FOLDER'], path)

@app.route('/v1/twitterCredentials', methods = ["GET", "POST"])
def tweetCredentials(supports_credentials=True):
    if request.method == 'POST':
        session['accessToken'] = request.form.get('accessToken')
        session['secret'] = request.form.get('secret')
        return {
            "status": "ok"
        }
    else :
        credentials = {
            'accessToken': session.get('accessToken'),
            'secret': session.get('secret')
        }
        return credentials

@app.route('/v1/tweet', methods = ["POST"])
def tweet():
    print(request.form.get('accessToken'))
    print(request.form.get('secret'))
    print(request.form.get('description'))
    print(request.form.get('filename'))

    post_with_large_file(
        request.form.get('accessToken'),
        request.form.get('secret'),
        request.form.get('description'),
        os.path.join(UPLOAD_FOLDER, str(request.form.get('filename')))
    )
    
    return "OK"

if __name__ == "__main__":
    app.run(debug=True)