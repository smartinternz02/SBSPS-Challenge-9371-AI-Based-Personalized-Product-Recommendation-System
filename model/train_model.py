import numpy as np
import pandas as pd
import seaborn as sns
import math
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle

def train_model():
    #Read the csv file and assign column names as per problem statement description
    EG_df = pd.read_csv('electronic_gadgets_dataset.csv')

    print("===> EG_df")
    print(EG_df)

    print("===> EG_df.shape")
    print(EG_df.shape)

    print("===> EG_df['Product Name'].unique()")
    print(EG_df['Product Name'].unique())

    print("===> EG_df['Brand'].unique()")
    print(EG_df['Brand'].unique())

    print("===> EG_df.dtypes")
    print(EG_df.dtypes)

    print("===> EG_df.info()")
    print(EG_df.info())

    print('Number of missing values across columns: \n',EG_df.isna().sum())

    # => MODEL

    print("===> EG_df.head()")
    print(EG_df.head())

    # Add 'Product Tag' and 'Model Tag' field
    # Convert to array of words from sentence, using spaces to split
    EG_df['Product Tag'] = EG_df['Product Name'].apply(lambda x:x.split())
    EG_df['Model Tag'] = EG_df['Model'].apply(lambda x:x.split())

    print("===> EG_df.head()")
    print(EG_df.head())

    # Combine 'Product Tag' and 'Model Tag'
    EG_df['tags'] = EG_df['Product Tag']+EG_df['Model Tag']

    # Use only selected columns
    EG_df = EG_df[['Product_Id', 'Picture URL', 'Brand', 'Product Name', 'Model', 'Price in India', 'Ratings', 'tags']]

    print("===> EG_df.head()")
    print(EG_df.head())

    # Again create a sentence by join array of words with space
    EG_df['tags']=EG_df['tags'].apply(lambda x:" ".join(x))

    EG_df['tags']=EG_df['tags'].apply(lambda x:x.lower())

    # Instantiate the vectorizer
    cv = CountVectorizer(max_features=5000,stop_words='english')

    # Convert tags to vector
    vectors = cv.fit_transform(EG_df['tags']).toarray()

    # Using cosine_similarity to give us the value btn 0 - 1.
    # It will convert degrees to value btn 0 - 1.
    similarity=cosine_similarity(vectors)

    # save dataframe as pickle file
    EG_df.to_pickle('transformed_eg_dataset.pkl')
    pickle.dump(similarity, open('similarity.pkl', 'wb'))

    def recommend(product):
        index = EG_df[EG_df['Product Name'] == product].index[0]
        distances = sorted(list(enumerate(similarity[index])),reverse=True,key = lambda x: x[1])
        for i in distances[1:6]:
            print(EG_df.iloc[i[0]])

    recommend('Nikon D7200 DSLR Camera (24.2MP, Black)')

# USING TRY CATCH. BCZ THE ERROR IS MORE READABLE
try:
    print("Running ......")
    # # filename is the first argument

    train_model()

except Exception as e:
    print("===== An error occurred while running the file =====")
    print(e)