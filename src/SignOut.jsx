
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/compat/auth';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { auth } from './firebase';

function Signout() {
  const nav=useNavigate();
  const handlecng=()=>{
    nav('/');
    auth.signOut();
  }
    return auth.currentUser && (
      <IconButton color='inherit' onClick={handlecng}aria-label='sign out'>
        <LogoutIcon/>
      </IconButton>
      
    )
  }
  export default Signout;