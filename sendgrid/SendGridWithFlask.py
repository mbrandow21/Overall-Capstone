import os
from flask import Flask, render_template, request, redirect, url_for, flash
from flask_mail import Mail, Message

app = Flask(__name__)
app.config['SECRET_KEY'] = 'top-secret!'
app.config['MAIL_SERVER'] = 'smtp.sendgrid.net'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'apikey'
app.config['MAIL_PASSWORD'] = os.environ.get('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')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('jmcdonald46@my.gcu.edu')
mail = Mail(app)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        recipient = request.form['recipient']
        msg = Message('Twilio SendGrid Test Email', recipients=[recipient])
        msg.body = ('Congratulations! You have sent a test email with '
                    'Twilio SendGrid!')
        msg.html = ('<h1>Twilio SendGrid Test Email</h1>'
                    '<p>Congratulations! You have sent a test email with '
                    '<b>Twilio SendGrid</b>!</p>')
        mail.send(msg)
        flash(f'A test message was sent to {recipient}.')
        return redirect(url_for('index'))
    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=True)