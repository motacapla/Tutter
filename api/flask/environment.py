"""
    DEV  : development
    PROD : production
"""
HOST="DEV"

"""
    default PROD
"""
API_SERVER_HOST_URL='http://tutter.org:5000'
UPLOAD_FOLDER = '/var/www/images'

if HOST == 'DEV':
    API_SERVER_HOST_URL='http://localhost:5000'
    UPLOAD_FOLDER = './v1/image'