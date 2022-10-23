from flask import Blueprint, request, Response
import json
import numpy as np
import pandas as pd
from matplotlib import pyplot as plt
import seaborn as sns
from pprint import pprint
import re
import sys
import pickle
import os

server = Blueprint('auth', __name__)

def string_from_qid(qid):
  return f'question_id=CAST(\'{qid}\' as uuid)'

@server.route("/test-flask", methods=['GET'])
def testFlask():
  return Response("Flask server is working", status=200, mimetype='application/json')

@server.route("/search", methods=['POST'])
def searchGadgets():
  try:
      
    data = json.loads(request.data)
    query = data['query']
    limit = data['limit']
    pageNo = data['pageNo']

    hasMore = False
    
    products = []
    # the __file__ constant is relative to the current working directory
    CWD = os.path.dirname(os.path.realpath(__file__))

    # read pickle file as dataframe
    EG_df = pd.read_pickle(CWD+"\\transformed_eg_dataset.pkl")
    
    print(query)

    values = EG_df['tags'].str.contains(query.lower())
    foundProductCount = 0

    for index, value in enumerate(values):
      # one extra for hasMore status
      if foundProductCount == limit*pageNo + 1:
        break
      if value == True:
        # print(str(index) + "=>" + str(value))
        products.append({
            'id': EG_df.iloc[index]['Product_Id'],
            'picture_url': EG_df.iloc[index]['Picture URL'],
            'brand': EG_df.iloc[index]['Brand'],
            'product_name': EG_df.iloc[index]['Product Name'],
            'model': EG_df.iloc[index]['Model'],
            'price_inr': EG_df.iloc[index]['Price in India'],
            'ratings': EG_df.iloc[index]['Ratings'],
        })
        foundProductCount+=1

    if len(products) > limit*pageNo:
      if pageNo == 1:
        # limit non-inclusive
        products = products[0:limit]
        hasMore = True
      else:
        # limit non-inclusive
        products = products[limit*(pageNo-1):limit*pageNo]
        hasMore = True
    else:
      products = products[limit*(pageNo-1):len(products)]


    # jsonify produces a full response object.
    # json.dumps produces only the response body.
    return Response(json.dumps({'products': products, 'hasMore': hasMore}), status=200, content_type='application/json')
  except Exception as e:
    print("===== ERROR ROUTE :- /api/search =====")
    print(e)
    return Response("Internal Search Error", status=400, content_type='application/json')


@server.route("/product", methods=['GET'])
def getProduct():
  try:
      
    product_name = request.args.get("name")
    
    CWD = os.path.dirname(os.path.realpath(__file__))

    EG_df = pd.read_pickle(CWD+"\\transformed_eg_dataset.pkl")
    
    print(product_name)

    index = EG_df[EG_df['Product Name'] == product_name].index[0]

    product = {
      'id': EG_df.iloc[index]['Product_Id'],
      'picture_url': EG_df.iloc[index]['Picture URL'],
      'brand': EG_df.iloc[index]['Brand'],
      'product_name': EG_df.iloc[index]['Product Name'],
      'model': EG_df.iloc[index]['Model'],
      'price_inr': EG_df.iloc[index]['Price in India'],
      'ratings': EG_df.iloc[index]['Ratings'],
    }

    return Response(json.dumps(product), status=200, content_type='application/json')
  except Exception as e:
    print("===== ERROR ROUTE :- /api/product =====")
    print(e)
    return Response("Internal Search Error", status=400, content_type='application/json')

@server.route("/recommend_products", methods=['GET'])
def recommendProducts():
  try:
      
    product_name = request.args.get("name")
    brand = request.args.get("brand")
    includeSameBrand = request.args.get("sameBrand")
    limit = request.args.get("limit")
    limit = int(limit)
    pageNo = request.args.get("pageNo")
    pageNo = int(pageNo)
    hasMore = False

    recommended_products = []
    # the __file__ constant is relative to the current working directory
    CWD = os.path.dirname(os.path.realpath(__file__))

    # read pickle file as dataframe
    EG_df = pd.read_pickle(CWD+"\\transformed_eg_dataset.pkl")
    similarity = pd.read_pickle(CWD+"\\similarity.pkl")
    
    print(product_name)

    index = EG_df[EG_df['Product Name'] == product_name].index[0]
    distances = sorted(list(enumerate(similarity[index])),reverse=True,key = lambda x: x[1])

    
    if includeSameBrand == "true":
      foundProductCount = 0
      # when "includeSameBrand" is true it will include all the products whose brand is same afterwards it will include other brands as well. Therefore, foundProductCount will always be "greater than equal" limit*pageNo. If limit*pageNo is too big then whole loop will execute 
      for i in distances:
        if foundProductCount >= limit*pageNo + 1:
          break
        else:
          print(EG_df.iloc[i[0]])
          recommended_products.append(EG_df.iloc[i[0]])
          foundProductCount+=1
    else:
      for i in distances:
        print(EG_df.iloc[i[0]]["tags"].lower())
        if len(recommended_products) == limit*pageNo + 1:
          break;
        if brand.lower() not in EG_df.iloc[i[0]]["tags"].lower():
          recommended_products.append(EG_df.iloc[i[0]]) 

    if len(recommended_products) > limit*pageNo:
      if pageNo == 1:
        # limit non-inclusive
        recommended_products = recommended_products[0:limit]
        hasMore = True
      else:
        # limit non-inclusive
        recommended_products = recommended_products[limit*(pageNo-1):limit*pageNo]
        hasMore = True
    else:
      recommended_products = recommended_products[limit*(pageNo-1):len(recommended_products)]

    recommended_products = [{
      'id': product['Product_Id'],
      'picture_url': product['Picture URL'],
      'brand': product['Brand'],
      'product_name': product['Product Name'],
      'model': product['Model'],
      'price_inr': product['Price in India'],
      'ratings': product['Ratings'],
    } for product in recommended_products]      

    # jsonify produces a full response object.
    # json.dumps produces only the response body.
    return Response(json.dumps({'recommended_products': recommended_products, 'hasMore': hasMore}), status=200, content_type='application/json')
  except Exception as e:
    print("===== ERROR ROUTE :- /api/recommended_products =====")
    print(e)
    return Response("Internal Search Error", status=400, content_type='application/json')

