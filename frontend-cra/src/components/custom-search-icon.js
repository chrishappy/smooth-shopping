import React from "react";
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, TextField } from '@mui/material';
import { useNavigate } from "react-router-dom";

const CustomSearchIcon = () => {

  const [keys, setKeys] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const navigator = useNavigate();

  return (
    <Box
      component="form"
      className="search-form--popout"
      sx={{
        display: 'flex',
        alignItems: 'flex-end' 
      }}>
      <Box
        className="search-form--inner">
        <TextField 
              id="search__keys" 
              className="search__textfield"
              type="text"
              variant="filled" 
              label="Search..."
              sx={{ background: '#fff', mb: '2rem', display: open && false ? 'block' : 'none !important' }} 
              onInput={(e) => setKeys(e.target.value)}/>
        <IconButton
          className="search__icon"
          type="submit"
          component={Button}
          style={{ color: 'white' }}
          aria-label={'search'}
          onClick={() => {
            open 
              ? navigator(`/search?keys=${encodeURIComponent(keys)}`)
              : setOpen(true);
          }}>
            <SearchIcon fontSize="large" />
        </IconButton>
      </Box>
    </Box>
  )
}

export default CustomSearchIcon;