class Config():
    DEBUG = False
    SQLALCHEMY_TRACK_MODIFICATIONS = True

class LocalDevelopmentConfig(Config):
    # configuration
    SQLALCHEMY_DATABASE_URI = "sqlite:///lmsv2.sqlite3"
    DEBUG = True

    # config for security
    SECRET_KEY = "this-is-a-secret-key"  # hash user creds in session
    SECURITY_PASSWORD_HASH = "bcrypt"  # mechanism for hashing password
    SECURITY_PASSWORD_SINGLE_HASH = "bcrypt"
    SECURITY_PASSWORD_SALT = "this-is-a-password-salt-jsdfhgjkahsjh"  # helps in hashing
    WTF_CSRF_ENABLED = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = "Authentication-Token"