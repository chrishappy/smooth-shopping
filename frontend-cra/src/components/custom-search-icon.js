import React from "react";
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, TextField } from '@mui/material';
import { useNavigate } from "react-router-dom";
import "./custom-search-icon.css";

const CustomSearchIcon = () => {

  const [keys, setKeys] = React.useState('');
  const [open, setOpen] = React.useState(false);
  // setOpen(false);

  const navigator = useNavigate();

  return (
    <Box
      component="form"
      className="search-form"
      sx={{
        display: 'flex',
        alignItems: 'flex-end' 
      }}>
      <Box
        className="search-form__inner">
        <Box className={open ? "search-form__keys search-form__keys--open" : "search-form__keys"}>
          <TextField 
              id="search__keys" 
              type="text"
              // variant="filled" 
              label="Search..."
              sx={{ background: '#fff', mb: '2rem', display: open ? 'block' : 'none !important' }} 
              onInput={(e) => setKeys(e.target.value)}/>
        </Box>
        <IconButton
          className="search-form__icon"
          type="submit"
          component={Button}
          style={{ color: 'white' }}
          aria-label={'search'}
          onClick={(e) => {
            e.preventDefault();
            if (open) {
              setOpen(false);
              navigator(`/search?keys=${encodeURIComponent(keys)}`);
            } 
            else {
              setOpen(true);
            }
          }}>
            <SearchIcon fontSize="large" />
        </IconButton>
      </Box>
    </Box>
  )
}

export default CustomSearchIcon;