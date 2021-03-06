import tweepy
import config

def post_with_large_file(access_token, secret, description, filename):
    auth = tweepy.OAuthHandler(config.CONSUMER_KEY, config.CONSUMER_SECRET)
    auth.set_access_token(access_token, secret)

    api = tweepy.API(auth)
    api.update_with_media(status = description, filename = filename)

def get_me(access_token, secret):
    auth = tweepy.OAuthHandler(config.CONSUMER_KEY, config.CONSUMER_SECRET)
    auth.set_access_token(access_token, secret)

    api = tweepy.API(auth)
    me = api.me()

    return {
        'screen_name': me.screen_name,
        'profile_image_url': me.profile_image_url
    }