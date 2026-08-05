import appdirs
import shutil
import os

cache_dir = appdirs.user_cache_dir(appname="psrqpy", appauthor=False)
print("Cache directory:", cache_dir)

if os.path.exists(cache_dir):
    print("Contents:", os.listdir(cache_dir))
    shutil.rmtree(cache_dir)
    print("Cache cleared.")
else:
    print("Still not found — see below for manual check.")