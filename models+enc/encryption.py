import tenseal as ts
import requests

context = ts.context(ts.SCHEME_TYPE.BFV,
                      poly_modulus_degree=4096,
                      plain_modulus=1032193)
context.generate_galois_keys()
context.global_scale = 2**40
secret_context = context.serialize(save_secret_key = True)

def homoenc(a, b, s):

  a=[a]
  b=[b]

  enc_v1 =ts.bfv_vector(context, a)
  enc_v2 =ts.bfv_vector(context, b)
  enc_result = enc_v1 * enc_v2

  # if enc_result.decrypt() == [1]:
  #   print("fallen")
  # else:
  #   print("not fallen")
  print(enc_result.decrypt()[0])

#date and time
  from datetime import datetime

  current_time = datetime.now()

  formatted_date = current_time.strftime("%Y-%m-%d")
  print("Formatted current date:", formatted_date)

  formatted_time = current_time.strftime("%H:%M:%S")
  print("Formatted current time:", formatted_time)
  # hr,min,sec = formatted_time.split(":")
  # day,month,year = formatted_date.split("-")

  # tm=[[int(hr)],[int(min)],[int(sec)]]
  # dt=[[int(day)],[int(month)],[int(year)]]

  # enc_tm = [[ts.bfv_vector(context,tm[0])],
  #           [ts.bfv_vector(context,tm[1])],
  #           [ts.bfv_vector(context,tm[2])]]

  # enc_date = [[ts.bfv_vector(context,dt[0])],
  #             [ts.bfv_vector(context,dt[1])],
  #             [ts.bfv_vector(context,dt[2])]]


  #return enc_tm,enc_date

  #decryption at other endpoint:

  # dec_array = [enc_tm[0][0].decrypt(),
  #             enc_tm[1][0].decrypt(),
  #             enc_tm[2][0].decrypt()]

  # dec_array1 = [enc_date[0][0].decrypt(),
  #               enc_date[1][0].decrypt(),
  #               enc_date[2][0].decrypt()
  #             ]
  
  predictionData = {
    'username':'mishal',
    'timestamp':formatted_time,
    'date': formatted_date,
    'imagedata':s,
    'status':'fallen'
  };
    
  url = 'https://91ln5ijl3i.execute-api.eu-north-1.amazonaws.com/new/alert'
  headers = {'Content-Type': 'application/json'}

  try:
      response = requests.post(url, json=predictionData, headers=headers)
      response_data = response.json()
      print(response_data)
  except requests.exceptions.RequestException as e:
      print('Error sending data to server:', e)

  print(f"Fell at {formatted_time} on {formatted_date}")
  print(s)