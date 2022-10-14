from server import create_app

app = create_app()

# only if we run this file it's __name__ will be '__main__'
if __name__ == "__main__":
    app.run(debug=True, port=5000)
    # debug=True will automatically re-run the server when changes are made