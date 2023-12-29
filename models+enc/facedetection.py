import tenseal as ts
from deepface import DeepFace
import base64
import math
from itertools import combinations
import os

#FINDING EMBEDDINGS

# img1 = r"C:\Users\alosh\Downloads\test\img1.jpg"
# img2 = r"C:\Users\alosh\Downloads\test\img2.jpg"

# WRITE FUNCTION

def write_data (file_name, file_content):

    if type(file_content)==bytes:
        file_content = base64.b64encode(file_content) # bytes to base64

    with open(file_name, 'wb') as f:
        f.write(file_content)

# READ FUNCTION
        
def read_data(file_name):
    
    with open(file_name, 'rb') as f:
        file_content = f.read()
    return base64.b64decode(file_content) # base64 to bytes

image_dir = ""

image_paths = [os.path.join(image_dir, filename) for filename in os.listdir(image_dir) if filename.endswith(('.jpg', '.jpeg', '.png'))]
image_pairs = combinations(image_paths, 2)

for img1, img2 in image_pairs:

    img1_embed = DeepFace.represent(img1, model_name='Facenet512', enforce_detection=False)[0]['embedding']
    img2_embed = DeepFace.represent(img2, model_name='Facenet512', enforce_detection=False)[0]['embedding']

    # CLIENT SIDE FHE

    context = ts.context(ts.SCHEME_TYPE.CKKS, poly_modulus_degree = 8192, coeff_mod_bit_sizes = [60, 40, 40, 60])
    context.generate_galois_keys()
    context.global_scale = 2**40
    secret_context = context.serialize(save_secret_key = True)

    write_data('./secret.txt', secret_context)

    context.make_context_public()
    public_context = context.serialize()
    write_data('./public.txt', public_context)

    del context, secret_context, public_context

    # Encryption: Moving from Client Side to Cloud

    context = ts.context_from(read_data("./secret.txt"))
    enc_v1 = ts.ckks_vector(context, img1_embed)
    enc_v2 = ts.ckks_vector(context, img2_embed)

    write_data('./enc_v1.txt', enc_v1.serialize())
    write_data('./enc_v2.txt', enc_v2.serialize())

    del context, enc_v1, enc_v2

    # Cloud Side Processing

    context = ts.context_from(read_data('./public.txt'))

    enc_v1 = ts.lazy_ckks_vector_from(read_data('./enc_v1.txt'))
    enc_v2 = ts.lazy_ckks_vector_from(read_data('./enc_v2.txt'))

    enc_v1.link_context(context)
    enc_v2.link_context(context)

    euclidean_squared = enc_v1 - enc_v2
    euclidean_squared = euclidean_squared.dot(euclidean_squared)

    write_data ('./euclidean_squared.txt', euclidean_squared.serialize())

    del context, enc_v1, enc_v2, euclidean_squared

    # Decryption on client side

    context = ts.context_from(read_data('./secret.txt'))
    euclidean_squared = ts.lazy_ckks_vector_from(read_data('./euclidean_squared.txt'))
    euclidean_squared.link_context(context)

    euclidean_distance = math.sqrt(euclidean_squared.decrypt()[0])

    if euclidean_distance < 15:

        print(f"Pairs: {os.path.basename(img1)} and {os.path.basename(img2)} Euclidean distance: {euclidean_distance:.4f}")