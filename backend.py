import json
import zlib

def hash(decoded):
    number = zlib.crc32(decoded.encode())
    alph = "0123456789abcdefghijklmnopqrstuvwxyz"

    chars = []

    while number > 0:
        number, remainder = divmod(number, 36)
        char = alph[remainder]
        chars.append(char)

    enc = "".join(reversed(chars))
    
    return enc

def encoder(decoded):
    storage = {}

    with open("db.json", "r") as file:
        storage = json.load(file)
        file.close()

    print(json)

    if decoded in storage.values():
        for k, v in storage.items():
            if v == decoded:
                return k
    else:
        encoded = hash(decoded)
        storage[encoded] = f"https://{decoded}"

        with open("db.json", "w") as file:
            json.dump(storage, file, indent=4)
            file.close()
        return encoded
    
def decoder(encoded):
    storage = {}

    with open("db.json", "r") as file:
        storage = json.load(file)
        file.close()

    if encoded in storage:
        return storage[encoded]
    else:
        return None