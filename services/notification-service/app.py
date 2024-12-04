import os
from flask import Flask, request, jsonify
from flask_mail import Mail, Message
from dotenv import load_dotenv

# Cargar variables de entorno desde el archivo .env
load_dotenv()

app = Flask(__name__)

# Configuración de Flask-Mail (usando variables de entorno)
app.config['MAIL_SERVER'] = os.getenv('MAIL_HOST')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587)) 
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_SECURE') == 'true' 
app.config['MAIL_USERNAME'] = os.getenv('MAIL_HOST_USER')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_HOST_PASSWORD')


mail = Mail(app)

@app.route('/sendConfirmation', methods=['POST'])
def send_confirmation():
    data = request.get_json()
    
    # Obtener los datos del cuerpo de la solicitud
    email = data.get('email')
    paciente_nombre = data.get('pacienteNombre')
    medico_nombre = data.get('medicoNombre')  # Nombre del médico
    fecha_cita = data.get('fecha')
    hora_inicio = data.get('hora_inicio')
    hora_fin = data.get('hora_fin')
    tipo = data.get('tipo')  # Tipo de cita (presencial/virtual)

    # Verificar que los datos necesarios estén presentes
    if not email or not paciente_nombre or not medico_nombre or not fecha_cita or not hora_inicio or not hora_fin or not tipo:
        return jsonify({"error": "Faltan datos"}), 400

    # Crear el mensaje con más detalles
    msg = Message(
        'Confirmación de Cita',
        recipients=[email],
        body=(
            f'Hola {paciente_nombre},\n\n'
            f'Tu cita ha sido agendada para el {fecha_cita}.\n\n'
            f'Detalles de la cita:\n'
            f'Médico: {medico_nombre}\n'
            f'Fecha: {fecha_cita}\n'
            f'Hora de inicio: {hora_inicio}\n'
            f'Hora de fin: {hora_fin}\n'
            f'Tipo de cita: {tipo}\n\n'
            f'Por favor, revisa esta información y confirma tu cita.\n\n'
            f'Saludos,\nEl equipo de Citas.'
        )
    )

    try:
        # Intentar enviar el correo
        mail.send(msg)
        return jsonify({"message": "Correo de confirmación enviado"}), 200
    except Exception as e:
        # Si hay un error al enviar el correo
        return jsonify({"error": f"Error al enviar el correo: {str(e)}"}), 500



@app.route('/sendRegistration', methods=['POST'])
def send_registration():
    data = request.get_json()
    email = data.get('email')
    usuario_nombre = data.get('usuarioNombre')

    if not email or not usuario_nombre:
        return jsonify({"error": "Faltan datos"}), 400

    msg = Message(
        'Notificación de Registro',
        recipients=[email],
        body=f'Hola {usuario_nombre},\n\nTu registro ha sido completado exitosamente.\n\nSaludos,\nEl equipo de Citas.'
    )

    try:
        mail.send(msg)
        return jsonify({"message": "Correo de registro enviado"}), 200
    except Exception as e:
        return jsonify({"error": f"Error al enviar el correo: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3002)
