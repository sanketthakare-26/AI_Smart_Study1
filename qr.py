import qrcode

# Data to store in the QR code
data = "https://6a586349b1e0295e1711b4e5--peppy-biscochitos-03fbf0.netlify.app/"

# Create QR code
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)

qr.add_data(data)
qr.make(fit=True)

# Generate image
img = qr.make_image(fill_color="black", back_color="white")

# Save image
img.save("qrcode.png")

print("QR Code generated successfully!")