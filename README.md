#### 4. IBM AI Based Personalized Product Recommendation System

**=> 1. Generating necessary files required for running the server**

1. Run the file `train_model.py` in the folder named `model`.
2. 2 files namely `similarity.pkl` and `transformed_eg_dataset.pkl` will be generated.
3. Copy both these files in the folder `backend/server`.

**=> 2. Running the server**

1. Install the necessary packages.
2. Navigate to folder `backend` and in the cmd run the following command.

```
python run_server.py
```

**=> 3. Running the frontend**

1. Navigate to folder `frontend/recommend-gadgets`.
2. Make sure `yarn` package manager is installed.
3. Run the following command.

```
yarn run dev
```

4. To build a product ready app run the following command which will create an optimized build for deployment

```
yarn run build
```

**=> Demo of the project**

**=> Home screen with search for searching the products**

![image](images/1.PNG)

**=> Product screen with product details and the recommended products of `different brands`**

![image](images/2.PNG)

**=> Product screen with product details and the recommended products of the `same brand`**

![image](images/3.PNG)
