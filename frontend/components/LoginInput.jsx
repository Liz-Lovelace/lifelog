import React, { useState } from 'react';
import { login } from '../store/store';

export default function LoginInput() {
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.trim()) {
      const result = await login(password);
      if (result.success) {
        alert('Logged in successfully');
        setPassword('');
      } else {
        alert(result.error || 'Login failed');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{position: 'absolute', top: '10px', left: '10px'}}>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        style={{marginRight: '0.5em', padding: '0.5em'}}
      />
    </form>
  );
}
