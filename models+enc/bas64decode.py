# SERVER SIDE DECRYPTING
import base64

def decode_b64_to_image(base64_string, output_path):
    image_data = base64.b64decode(base64_string)
    with open(output_path, "wb") as img_file:
        img_file.write(image_data)

# Decode Base64 back to image
output_image_path = ""
decode_b64_to_image(base64_string, output_image_path)
