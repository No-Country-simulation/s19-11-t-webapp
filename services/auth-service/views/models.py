"""

Tokens de sesión (JWT): Estos tokens se generan una vez que el usuario se autentica correctamente.
El token contiene la información del usuario (como su user_id y roles) y es necesario para que el usuario pueda hacer peticiones autenticadas en el sistema.

Información temporal sobre la sesión: Aunque la mayor parte de la sesión se maneja a través del token JWT (que es auto-contenido),
podrías querer almacenar información adicional como los tokens de refresco, el estado de la sesión, o la fecha de expiración de un token, etc.
Todo esto debe ser temporal, ya que está relacionado con la sesión del usuario.

"""