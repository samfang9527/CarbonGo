
import styled from "styled-components";
import DirectionsIcon from '@mui/icons-material/Directions';
import Co2Icon from '@mui/icons-material/Co2';

const MainContainer = styled.div`
    border: none;
    border-radius: 20px;
    position: absolute;
    bottom: 15%;
    left: 15%;
    z-index: 3;
    display: flex;
    flex-direction: column;
    width: 80%;
    align-items: center;
    background-color: rgba(255, 255, 255, 0);

    @media (max-width: 420px) {
        width: 70%;
    }
`;

const InfoContainer = styled.div`
    background-color: white;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 20px;
`;

const DistanceContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 5px 0 0 0;
`;

const DistanceText = styled.p`
    margin: 5px;
`;

const CarbonContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 0 0 5px 0;
`;

const CarbonText = styled.p`
    margin: 5px;
`;

const Divider = styled.hr`
    width: 40%;
    height: 2px;
    background-color: black;
    border: none;
    margin: 2px;
`;

const CallCarBtn = styled.button`
    width: 100%;
    margin: 5px 0 0 0;
    border: none;
    color: white;
    background-color: rgb(50, 100, 180);
    padding: 5px;
    font-size: 14px;
    border-radius: 5px;
`;

const InfoCard: React.FC = () => {

    return (
        <MainContainer>
            <InfoContainer>
                <DistanceContainer>
                    <DirectionsIcon />
                    <DistanceText>2 KM</DistanceText>
                </DistanceContainer>
                <Divider />
                <CarbonContainer>
                    <Co2Icon />
                    <CarbonText>0.23 KG</CarbonText>
                </CarbonContainer>
            </InfoContainer>
            <CallCarBtn>預約叫車</CallCarBtn>
        </MainContainer>
        
    )

}

export default InfoCard;
