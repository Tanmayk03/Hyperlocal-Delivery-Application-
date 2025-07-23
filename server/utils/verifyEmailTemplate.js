const verifyEmailTemplate = ({ name, url }) => {
  if (!name || !url) {
    console.warn('verifyEmailTemplate missing name or url:', { name, url });
    // return some fallback or throw an error if you want strict checking
  }
  return `
    <p>Dear ${name},</p>    
    <p>Thank you for registering Binkeyit.</p>   
    <a href="${url}" style="color:white; background: #071263 ; margin-top: 10px; padding: 20px; display: block;">
        Verify Email
    </a>
  `;
};
export default verifyEmailTemplate;
