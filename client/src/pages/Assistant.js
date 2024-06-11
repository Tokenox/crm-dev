import React, { useState } from 'react';
import { Container, Box, Paper, Grid, TextField, Button, Typography, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { baseURL } from '../libs/client/apiClient';

function Assistant() {
  const [messages, setMessages] = useState([{ id: 1, text: 'Hello, how can I help you?', isBot: true }]);
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSendMessage = async () => {
    const userMessage = userInput.trim();
    if (!userMessage) return; // Prevent sending empty messages

    setUserInput(''); // Clear the input field

    // Add user message to chat
    setMessages((messages) => [...messages, { id: messages.length + 1, text: userMessage, isBot: false }]);
    setIsProcessing(true); // Set processing to true

    try {
      const response = await fetch(`${baseURL}/auth/askOpenAI`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: userMessage })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();

      // Add AI response to chat
      if (responseData.success && responseData.data) {
        setMessages((messages) => [...messages, { id: messages.length + 2, text: responseData.data.response, isBot: true }]);
      } else {
        throw new Error('Response data is not valid');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((messages) => [...messages, { id: messages.length + 2, text: "Sorry, I couldn't process your request.", isBot: true }]);
    } finally {
      setIsProcessing(false); // Set processing to false
    }
  };

  return (
    <>
      <Container maxWidth="sm">
        <Box sx={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ pt: 3 }}>
            Chat with Voltaic Assistant
          </Typography>

          <Paper elevation={3} sx={{ flexGrow: 1, overflowY: 'auto', p: 2, mb: 2 }}>
            <Grid container spacing={2} direction="column-reverse">
              {isProcessing && (
                <Grid item sx={{ display: 'flex', justifyContent: 'start', width: '100%' }}>
                  <CircularProgress size={24} />
                </Grid>
              )}
              {messages.map((message, index) => (
                <Grid item key={index} sx={{ width: '100%' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: message.isBot ? 'start' : 'end'
                    }}
                  >
                    <Paper
                      sx={{
                        p: 1,
                        bgcolor: message.isBot ? '#e0f7fa' : '#80deea',
                        borderRadius: 2
                      }}
                    >
                      <Typography variant="body1">{message.text}</Typography>
                    </Paper>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button variant="contained" color="primary" onClick={handleSendMessage} sx={{ ml: 1 }}>
              <SendIcon />
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default Assistant;
