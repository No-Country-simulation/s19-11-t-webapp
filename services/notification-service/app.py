import os
import smtplib
import ssl
from flask import Flask, request, jsonify
from flask_mail import Mail, Message
from dotenv import load_dotenv
import socket

# Cargar variables de entorno desde el archivo .env
load_dotenv()

app = Flask(__name__)

# Configuración de Flask-Mail (usando variables de entorno)

app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 1025))
#app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS') == 'true'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')

mail = Mail(app)

@app.route('/sendConfirmation', methods=['POST'])
def send_confirmation():
    data = request.get_json()
    email = data.get('email')
    paciente_nombre = data.get('pacienteNombre')
    fecha_cita = data.get('fecha')

    if not email or not paciente_nombre or not fecha_cita:
        return jsonify({"error": "Faltan datos"}), 400

    try:
        msg = Message(
            subject=f'Confirmación de Cita',
            recipients=[email],
            body=f'Hola {paciente_nombre},\n\nTu cita ha sido agendada para el {fecha_cita}.\n\nSaludos,\nEl equipo de Citas.'
        )
        
        #print(mail.server)
        #mail.server =  os.getenv('MAIL_SERVER')
        #print(mail.server)

        #mail.server = smtplib.SMTP('smtp.gmail.com', 25)
        #mail.server.connect("smtp.gmail.com",465)
        #mail.send(msg)
        
        socker_local= socket.getaddrinfo('localhost', 3002)
        socket_docker = socket.getaddrinfo('186.158.240.60', 3002)
        socket_server = socket.getaddrinfo('186.158.240.60', 3002)
        server_print = smtplib.SMTP("64.233.167.109", port=587)
        
        print("socker_local",socker_local)
        print("socket_docker",socket_docker)
        print("socket_server",socket_server)


        context=ssl.create_default_context()

        server = smtplib.SMTP("smtp.gmail.com", port=587)
        server.connect("smtp.gmail.com",465)
        server.login(os.getenv('MAIL_USERNAME'), os.getenv('MAIL_PASSWORD'))
        msg_str = msg.as_string()
        server.sendmail(os.getenv('MAIL_USERNAME'), email, msg_str) 
        
        return jsonify({"message": "Correo de confirmación enviado"}), 200
    except Exception as e:
        return jsonify({"error": f"Error al enviar el correo: {str(e)}"}), 500


"""
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
"""


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3002)
