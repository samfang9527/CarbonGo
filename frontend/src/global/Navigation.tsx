
import styled from "styled-components";
import HomeIcon from '@mui/icons-material/Home';
import NearMeIcon from '@mui/icons-material/NearMe';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import { grey } from '@mui/material/colors';
import { useNavigate } from "react-router-dom";


const MainContainer = styled.div`
    display: flex;
    position: absolute;
    z-index: 3;
    bottom: 0;
    width: 100%;
    justify-content: space-evenly;
    background-color: rgb(50, 100, 180);
`;

const IconContainer = styled.div`
    width: 25%;
    height: 50px;
    background-color: rgb(50, 100, 180);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    
    :hover {
        background-color: rgba(50, 100, 150);
    }
`;


const Navigation: React.FC = () => {

    const navigate = useNavigate();
    
    return (
        <MainContainer>
            <IconContainer onClick={() => navigate('/')}>
                <HomeIcon sx={{color: grey[50], fontSize: 32}} />
            </IconContainer>
            <IconContainer>
                <NearMeIcon sx={{color: grey[50], fontSize: 32}} />
            </IconContainer>
            <IconContainer>
                <EnergySavingsLeafIcon sx={{color: grey[50], fontSize: 32}} />
            </IconContainer>
            <IconContainer>
                <PhoneAndroidIcon sx={{color: grey[50], fontSize: 32}} />
            </IconContainer>
        </MainContainer>
    )

}

export default Navigation;