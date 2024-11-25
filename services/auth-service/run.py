from app import create_app, db

app = create_app()

# Crear las tablas de la base de datos (si aún no existen)
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
