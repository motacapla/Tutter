import os
import cv2
import random
import string
import numpy as np
from flask import Flask, request, redirect, url_for, send_from_directory, render_template, session
from flask_cors import CORS
from werkzeug.utils import secure_filename
from datetime import datetime
from post_twitter import post_with_large_file
import config
import environment
import image_converter

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = environment.UPLOAD_FOLDER
app.secret_key = "".join([random.choice(string.ascii_letters + string.digits + '_' + '-' + '!' + '#' + '&')
                          for i in range(64)])
CORS(app, supports_credentials=True)

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

def random_str(n):
    return ''.join([random.choice(string.ascii_letters + string.digits) for i in range(n)])

@app.route("/v1/image", methods = ["POST"])
def upload():
    if request.files['file']:
        stream = request.files['file'].stream
        img_array = np.asarray(bytearray(stream.read()), dtype=np.uint8)
        img = cv2.imdecode(img_array, 1)

        img = image_converter.resize_img(img)

        dt_now = datetime.now().strftime("%Y_%m_%H_%M_%S_") + random_str(5)
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], "original_" + dt_now + ".png")
        cv2.imwrite(save_path, img)

        remove_bg_save_path = image_converter.call_remove_bg_api(dt_now, save_path)

        converted_img_save_path = image_converter.convert_image_to_gyotaku(dt_now, remove_bg_save_path)
                
        response = {
            "filenameList": [converted_img_save_path.split('/')[-1], remove_bg_save_path.split('/')[-1]]
        }
        return response

@app.route('/v1/image/<path:path>', methods = ["GET"])
def get_image(path):
    return send_from_directory(app.config['UPLOAD_FOLDER'], path)

@app.route('/v1/images', methods = ["GET"])
def get_images_url():
    def create_image_response(filename):
        return {
            "filename": filename,
            "url": environment.API_SERVER_HOST_URL + app.config['UPLOAD_FOLDER'].split('.')[-1] + '/' + filename
        }
    return {
        "images": [create_image_response(filename) for filename in request.args.get('filenameList').split(',')]
    }

@app.route('/v1/twitterCredentials', methods = ["GET", "POST"])
def tweet_credentials(supports_credentials=True):
    if request.method == 'POST':
        session['accessToken'] = request.form.get('accessToken')
        session['secret'] = request.form.get('secret')
        credentials = {
            "accessToken": session['accessToken'],
            "secret": session['secret']
        }
        return credentials
    else :
        credentials = {
            'accessToken': session.get('accessToken'),
            'secret': session.get('secret')
        }
        return credentials

@app.route('/v1/tweet', methods = ["POST"])
def tweet():
    post_with_large_file(
        request.form.get('accessToken'),
        request.form.get('secret'),
        request.form.get('description'),
        #request.form.get('filename')
        os.path.join(app.config['UPLOAD_FOLDER'], str(request.form.get('filename').split('/')[-1]))
    )
    
    return "OK"

if __name__ == "__main__":
    print("environment : " + environment.HOST)
    if environment.HOST == "DEV":
        app.run(debug=True)
    elif environment.HOST == "PROD" :
        app.run(host='0.0.0.0', port='5001')
    else:
        print("Something wrong")

application = app