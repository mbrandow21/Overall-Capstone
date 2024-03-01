import os
import sendgrid
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail



message = Mail(
    from_email='jmcdonald46@my.gcu.edu',
    to_emails='mcdonaldjordan4860@gmail.com'
)

message.template_id = 'd-a6f21258e2c04655b93b41397127ccac'

sg = SendGridAPIClient(api_key='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')
response = sg.send(message)
print(response.status_code, response.body, response.headers)

#def main(arrOfEmails):
    #return 