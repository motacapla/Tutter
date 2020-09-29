"""
    DEV  : development
    PROD : production
"""
HOST="PROD"
#HOST="DEV"
"""
    default PROD
"""
API_SERVER_HOST_URL='http://tutter.org'
PORT=':5000'
UPLOAD_FOLDER = '/var/www/images'
STATIC_IMAGE_PATH = '/images/'

if HOST == 'DEV':
    API_SERVER_HOST_URL='http://localhost:5000'
    UPLOAD_FOLDER = './v1/image'
    STATIC_IMAGE_PATH = '/v1/image/'