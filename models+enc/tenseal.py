import tenseal as ts
import numpy as np

def homoenc(a, b):
  context = ts.context(ts.SCHEME_TYPE.BFV,
                      poly_modulus_degree=4096,
                      plain_modulus=1032193)
  context.generate_galois_keys()
  context.global_scale = 2**40


  a=[a]  #inputs
  b=[b]

  enc_v1 =ts.bfv_vector(context, a)
  enc_v2 =ts.bfv_vector(context, b)

  enc_result = enc_v1 * enc_v2

  # if enc_result.decrypt() == [1]:
  #   print("fallen")
  # else:
  #   print("not fallen")
  return enc_result.decrypt()[0]

a = homoenc(1,3)
print(a)