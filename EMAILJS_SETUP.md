# EmailJS Setup Guide

## Steps to Configure EmailJS for the Booking Form

### 1. Create EmailJS Account
- Go to [emailjs.com](https://emailjs.com)
- Sign up for a free account
- Verify your email

### 2. Get Your Public Key
- Go to **Account > API Keys**
- Copy your **Public Key**
- Add to `.env.local`: `VITE_EMAILJS_PUBLIC_KEY=your_public_key`

### 3. Create an Email Service
- Go to **Email Services**
- Click **Add Service**
- Choose your email provider (Gmail, Outlook, etc.)
- Follow the authentication steps
- Copy the **Service ID**
- Add to `.env.local`: `VITE_EMAILJS_SERVICE_ID=your_service_id`

### 4. Create an Email Template
- Go to **Email Templates**
- Click **Create New Template**
- Use this template structure:

```
Subject: 📚 Your Kridha Demo Booking Confirmation

Body:
Hello {{to_name}},

Thank you for booking a free demo with Kridha!

**Booking Details:**
- Course: {{course}}
- Email: {{to_email}}
- Phone: {{phone}}

Our team will contact you within 24 hours to confirm your slot and discuss the curriculum.

Best regards,
Kridha Software Solutions Team
```

### 5. Add Template Variables
Make sure your template includes these variables:
- `{{to_name}}` - Student name
- `{{to_email}}` - Student email
- `{{course}}` - Selected course
- `{{phone}}` - Student phone

### 6. Get Template ID
- Copy your **Template ID** from the template settings
- Add to `.env.local`: `VITE_EMAILJS_TEMPLATE_ID=your_template_id`

### 7. Create `.env.local` File
In the root directory, create a `.env.local` file with:

```
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
```

### 8. Restart Development Server
```bash
npm run dev
```

The booking form should now send emails when users submit their details!

## Testing
1. Fill out the booking form on the website
2. Submit
3. Check your email for the confirmation
4. The submitter should receive their confirmation email too

## Troubleshooting
- **"EmailJS is not configured"** → Check your `.env.local` file has all three variables
- **Email not sending** → Verify your email service is properly authenticated in EmailJS
- **Template not working** → Ensure template variables match (use `{{variable_name}}` format)
