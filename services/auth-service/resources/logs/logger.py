from loguru import logger
import os

path = os.getcwd() + "\\resources\\logs"
file_name = 'log'
file_extension = 'log'

file = f'{path}\\{file_name}.{file_extension}'


logger.add(file,
           rotation='50 MB',  # Rotation: Rota los log automáticamente una vez que el archivo alcanza el tamaño
           level='TRACE',  # Nivel mínimo desde el cual comienza a guardar log
           retention='5d',  # Tiempo máximo que guarda los log
           colorize=True,  # Permite añadir colores al log
           enqueue=True,  # Garantiza el envio de logs ya que hace que el envio de los mismos sea asíncrono
           # serialize=True,  # Los registros se convierten en una cadena JSON
           # format="<green>{time}</green> <level>{message}</level>"  # Formato del mensaje
           )  # https://loguru.readthedocs.io/en/stable/api/logger.html
