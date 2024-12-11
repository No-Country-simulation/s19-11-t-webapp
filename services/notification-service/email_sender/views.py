from django.core.mail import send_mail
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

class SendEmailView(APIView):
    def post(self, request, *args, **kwargs):
        nombre_paciente = request.data.get('nombre_paciente')
        dia_semana = request.data.get('dia_semana')
        fecha = request.data.get('fecha')
        hora = request.data.get('hora')
        nombre_medico = request.data.get('nombre_medico')
        recipient_list = request.data.get('recipient_list')
        from_email = 'healthtechnotifications@gmail.com'
        
        subject = "Confirmación Cita Médica"
        message = f"Estimado/a {nombre_paciente}, \n\nLe confirmamos que su cita médica ha sido agendada para el día {dia_semana}, {fecha} a las {hora} con el Dr./Dra. {nombre_medico} en CareNet. \nPor favor, recuerde llegar con al menos 15 minutos de antelación para completar cualquier trámite previo a la consulta. \nSi necesita reprogramar o cancelar la cita, le solicitamos que nos avise con al menos 24 horas de anticipación. \nSi tiene alguna pregunta o requiere más información, no dude en contactarnos por correo electrónico.\n\n¡Lo esperamos en su cita!"

        if not nombre_paciente or not dia_semana or not fecha or not hora or not nombre_medico or not recipient_list:
        #if not recipient_list:
            return Response({'error': 'Faltan datos para enviar el mail.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            send_mail(subject, message, from_email, recipient_list)
            return Response({'success': 'Correo enviado con éxito.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
