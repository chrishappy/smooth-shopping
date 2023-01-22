import React from "react";
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, TextField } from '@mui/material';
import { useNavigate } from "react-router-dom";
import "./SearchIcon.css";

const CustomSearchIcon = () => {

  const [keys, setKeys] = React.useState('');
  const [open, setOpen] = React.useState(false);
  // setOpen(false);

  const navigator = useNavigate();

  React.useEffect(() => {

    const closeSearchIfClickOutside = (e) => {
      if (e.target.closest('#global-site-search') === null) {
        setOpen(false);
      }
    };
    
    async function init() {
      document.addEventListener('click', closeSearchIfClickOutside);
    }
      
    init();

    // Store cart items before unloading
    return () => {
      window.removeEventListener('beforeunload', closeSearchIfClickOutside);
    };

  }, [setOpen]);


  return (
    <Box
      id="global-site-search"
      component="form"
      className="search-form"
      sx={{
        display: 'flex',
        alignItems: 'flex-end' 
      }}>
      <Box
        className="search-form__inner">
        <Box className={"search-form__keys " + (open ? "search-form__keys--open" : "")}>
          {open 
            ? <TextField 
              id="search__keys" 
              type="text"
              variant="filled" 
              label="Search..."
              inputRef={input => input && input.focus()}
              sx={{ background: '#fff', mb: '2rem', width: '100%' }} 
              onInput={(e) => setKeys(e.target.value.trim())}/>
            : <></>
          }
        </Box>
        <IconButton
          className="search-form__icon"
          type="submit"
          component={Button}
          style={{ color: 'white' }}
          aria-label={'search'}
          disabled={open && keys.length === 0}
          onClick={(e) => {
            e.preventDefault();
            if (open) {
              if (keys.length > 0) {
                navigator(`/search?keys=${encodeURIComponent(keys)}`);
              }
              else {
                // TODO: target text box
              }
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