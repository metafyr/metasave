import uvicorn
import tenseal as ts
import utils
from fastapi import FastAPI
from pydantic import BaseModel

class User(BaseModel):
    username: str

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/genkeys")
async def generate_keys(user: User):
    context = ts.context(ts.SCHEME_TYPE.CKKS,
                     poly_modulus_degree=8192,
                     coeff_mod_bit_sizes=[60,40,40,60])
    context.generate_galois_keys()
    context.global_scale = 2**40

    secretkey = context.serialize(save_secret_key=True)
    utils.writedata('key-secret.txt',secretkey)

    return {"oky": "doky"}


if __name__ == "__main__":
    uvicorn.run("main:app", port=5000, host="localhost",reload=True)