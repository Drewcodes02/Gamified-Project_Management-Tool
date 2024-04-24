document.getElementById('updateProfileForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(this);
  fetch('/profile/updateProfile', {
    method: 'POST',
    body: formData
  }).then(response => {
    if (response.ok) {
      alert('Profile updated successfully.');
      console.log('Profile update successful.');
    } else {
      alert('Failed to update profile.');
      console.error('Failed to update profile.');
    }
  }).catch(error => {
    console.error('Error updating profile:', error);
    alert('Error updating profile. Please try again.');
  });
});

document.getElementById('changePasswordForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(this);
  fetch('/profile/changePassword', {
    method: 'POST',
    body: formData
  }).then(response => {
    if (response.ok) {
      alert('Password changed successfully.');
      console.log('Password change successful.');
    } else {
      response.text().then(text => {
        alert(text);
        console.error('Failed to change password:', text);
      });
    }
  }).catch(error => {
    console.error('Error changing password:', error);
    alert('Error changing password. Please try again.');
  });
});

document.getElementById('privacySettingsForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(this);
  formData.append('dataSharingPreferences', document.getElementById('dataSharingPreferences').checked);
  formData.append('activityVisibility', document.getElementById('activityVisibility').value);
  formData.append('notificationPreferences', document.getElementById('notificationPreferences').checked);

  fetch('/profile/privacySettings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      dataSharingPreferences: document.getElementById('dataSharingPreferences').checked,
      activityVisibility: document.getElementById('activityVisibility').value,
      notificationPreferences: document.getElementById('notificationPreferences').checked
    })
  }).then(response => {
    if (response.ok) {
      alert('Privacy settings updated successfully.');
      console.log('Privacy settings update successful.');
    } else {
      alert('Failed to update privacy settings.');
      console.error('Failed to update privacy settings.');
    }
  }).catch(error => {
    console.error('Error updating privacy settings:', error);
    alert('Error updating privacy settings. Please try again.');
  });
});