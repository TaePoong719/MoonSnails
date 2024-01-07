import styled from 'styled-components';
import {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import {CircularProgress, Paper} from '@material-ui/core';
import {GatewayStatus, useGateway} from '@civic/solana-gateway-react';
import {CandyMachine} from './candy-machine';

export const CTAButton = styled(Button)`
  position: reative !important;
  display: inline-block !important;
  margin: 0 !important;
  background-color: white !important;
  min-width: 250px !important;
  font-size: 1em !important;
`;

export const MintButton = ({
                               onMint,
                               candyMachine,
                               isMinting,
                               isActive,
                               isSoldOut,
                               isWhitelist,
                               isMinted
                           }: {
    onMint: () => Promise<void>;
    candyMachine: CandyMachine | undefined;
    isMinting: boolean;
    isActive: boolean;
    isSoldOut: boolean;
    isWhitelist: boolean;
    isMinted:boolean;
}) => {
    const {requestGatewayToken, gatewayStatus} = useGateway();
    const [clicked, setClicked] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    useEffect(() => {
        setIsVerifying(false);
        if (gatewayStatus === GatewayStatus.COLLECTING_USER_INFORMATION && clicked) {
            // when user approves wallet verification txn
            setIsVerifying(true);
        } else if (gatewayStatus === GatewayStatus.ACTIVE && clicked) {
            console.log('Verified human, now minting...');
            onMint();
            setClicked(false);
        }
    }, [gatewayStatus, clicked, setClicked, onMint]);

    return (
        <CTAButton
            disabled={
                candyMachine?.state.isSoldOut || isSoldOut ||
                isMinting ||
                !isActive ||
                isVerifying||
                !isWhitelist||
                isMinted
            }// 하나라도 true이면 사용못함
            onClick={async () => {
                if (isActive && candyMachine?.state.gatekeeper && gatewayStatus !== GatewayStatus.ACTIVE) {
                    console.log('Requesting gateway token');
                    setClicked(true);
                    await requestGatewayToken();
                } else {
                    console.log('Minting...');
                    await onMint();
                }
            }}
            variant="contained"
        >
            {!candyMachine ? (
                // <Image src="connect.gif"/> // 지갑 connect후 버튼들
                "connecting..."
            ) : candyMachine?.state.isSoldOut || isSoldOut ? (
                "Sold Out!"
                // "Thanks for your interest. Sold out!"
            ) : isActive ? (
                isVerifying ? 'VERIFYING...' :
                    isMinting ? (
                        <CircularProgress/>
                    ) : ( 
                        !isWhitelist? "Not Subject to Whitelist" :
                            isMinted? "Already Minted" : "MINT NOW!"
                        
                    )
            ) : (candyMachine?.state.goLiveDate ? (
                "SOON"
            ) : (
                "UNAVAILABLE"
            ))}
        </CTAButton>
    );
};
