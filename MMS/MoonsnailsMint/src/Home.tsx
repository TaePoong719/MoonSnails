import {useEffect, useState, useRef} from "react";
import styled from "styled-components";
import confetti from "canvas-confetti";
import * as anchor from "@project-serum/anchor";
import {LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js";
import {useAnchorWallet} from "@solana/wallet-adapter-react";
import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import {GatewayProvider} from '@civic/solana-gateway-react';
import Countdown from 'react-countdown/dist';
import {Snackbar, Paper, LinearProgress, Chip} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import {toDate, AlertState, getAtaForMint} from './utils';
import {MintButton} from './MintButton';
import Button from '@material-ui/core/Button';
import {
    CandyMachine,
    awaitTransactionSignatureConfirmation,
    getCandyMachineState,
    mintOneToken,
    mintOneToken_2,
    CANDY_MACHINE_PROGRAM,
} from "./candy-machine";
import {FaTwitter,FaDiscord,FaShoppingCart} from "react-icons/fa";
import Slider from './Slider';
import Axios from "axios";

const cluster = process.env.REACT_APP_SOLANA_NETWORK!.toString();
const decimals = process.env.REACT_APP_SPL_TOKEN_TO_MINT_DECIMALS ? +process.env.REACT_APP_SPL_TOKEN_TO_MINT_DECIMALS!.toString() : 9;
const splTokenName = process.env.REACT_APP_SPL_TOKEN_TO_MINT_NAME ? process.env.REACT_APP_SPL_TOKEN_TO_MINT_NAME.toString() : "TOKEN";

// const WalletContainer = styled.div`
//   display: flex;
//   flex-direction: row;
//   flex-wrap: wrap;
//   justify-content: center;
// 

const StyledButton = styled(Button)`
  display: block !important;
  color: black !important;
  width: 80px !important;
  height: 50px !important;
  background-color: white !important;
  text-align: center !important;
  padding: 0 !important;
  margin: 0 !important;
  font-size : 24px !important;
  
`

const WalletAmount = styled.div`
  color: white;
  width: auto;
  padding: 5px 5px 5px 16px;
  min-width: 48px;
  min-height: auto;
  border-radius: 22px;
  background-color: var(--main-text-color);
  box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%);
  box-sizing: border-box;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  font-weight: 500;
  line-height: 1.75;
  text-transform: uppercase;
  border: 0;
  margin: 0;
  display: inline-flex;
  outline: 0;
  position: relative;
  align-items: center;
  user-select: none;
  vertical-align: middle;
  justify-content: flex-start;
  gap: 10px;
`;

const Wallet = styled.ul`
  flex: 0 0 auto;
  padding: 0;
`;

const ConnectButton = styled(WalletMultiButton)`// connect button 뒤 네모
  border-radius: 18px !important;
  background-color: black;
  margin: 0 15px;
  height: 40px;

`;

const ConnectButton2 = styled(WalletMultiButton)`// 지갑 연결햇을때 배경
  border-radius: 18px !important;
  margin: 0 auto;
  height:35px;
`;

const ConnectButton3 = styled(WalletMultiButton)`
    opacity: 0;
    animation: fadeIn1 1s ease-out;
    animation-delay: 1.3s;
    animation-fill-mode: forwards;
    position: relative;
    border-radius: 18px !important;
    background-color: black;
    position: relative;
    left: 25%;
    overflow: hidden;
    color: white;
    width: 50%;
    font-size: 20px;
    margin-top: 20px;
`;

const Text2 = styled.div`
    width:100%;
    height:100%;
    position:relative;
    &::after{
        content: "Mint Now!";
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        color: white;
        transition: all 0.5s;
    }
    &::before{
        content: "Connect Wallet";
        display: block;
        position: absolute;
        left: 0;
        top: -100%;
        width: 100%;
        height: 100%;
        color: white;
        opacity: 0;
        transition: all 0.5s;
    }
    &:hover::after{
        opacity: 0;
        transform: translateY(100%);
    }
    &:hover::before{
        opacity: 1;
        transform: translateY(100%);
    }
`

// const NFT = styled.div`// MAIN뒤에 네모 
//   min-width: 420px;
//   padding: 5px 20px 20px 20px;
//   flex: 1 1 auto;
//   color: white;
// `;

const Card = styled(Paper)`
  display: inline-block;
  background-color: var(--card-background-lighter-color) !important;
  margin: 5px;
  opacity: 0.5;
  padding: 24px;
`;

const MintButtonContainer = styled.div`
  button.MuiButton-contained:not(.MuiButton-containedPrimary).Mui-disabled {
    color: #464646;
  }

  button.MuiButton-contained:not(.MuiButton-containedPrimary):hover,
  button.MuiButton-contained:not(.MuiButton-containedPrimary):focus {
    -webkit-animation: pulse 1s;
    animation: pulse 1s;
    box-shadow: 0 0 0 0.5em rgba(255, 255, 255, 0);
  }

  @-webkit-keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 skyblue;
    }
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 skyblue;
    }
  }

`;

// const SolExplorerLink = styled.a`
//   color: var(--title-text-color);
//   border-bottom: 1px solid var(--title-text-color);
//   font-weight: bold;
//   list-style-image: none;
//   list-style-position: outside;
//   list-style-type: none;
//   outline: none;
//   text-decoration: none;
//   text-size-adjust: 100%;

//   :hover {
//     border-bottom: 2px solid var(--title-text-color);
//   }
// `;

const MainContainer = styled.div`
    display: flex;
    margin: 10px 80px;
`;

const Text = styled.div`
@keyframes fadeIn1 {
    0% {
     opacity: 0;
     transform: translateX(-100px);  
    }
    
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
    animation: fadeIn1 1s ease-out;
    animation-delay: .9s;
    animation-fill-mode: forwards;

opacity: 0;
h1{
    line-height: 0.8em; 
}
`;

const Text1 = styled.div`
@keyframes fadeIn1 {
    0% {
     opacity: 0;
     transform: translateX(-100px);  
    }
    
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
    animation: fadeIn1 1s ease-out;
    animation-delay: 1.1s;
    animation-fill-mode: forwards;
    opacity: 0;

    `;

interface TTest{
    isWallet : boolean,
};

const TextContainer = styled.div`
    display: flex;    
    width: 600px;
    position: relative;
    top: ${(props:TTest) => props.isWallet? '0' : '4'}vw;
    transition-duration: 1s;
    flex-flow: column;
    justify-content: ${(props:TTest) => props.isWallet? 'space-around' : '' };
    text-align: center;
    padding:50px 20px;

    h1{
        font-size: 44px;
    }
    h3{
       font-size: 20px; 
    }
    `;

const DesContainer = styled.div`
@keyframes fadeIn {
    0% {
     opacity: 0;
     transform: translateX(100px);  
    }
    
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
    animation: fadeIn 1s ease-out;
    animation-delay: .1s;
    animation-fill-mode: forwards;
    display: flex;
    flex-direction: column;
    margin: 30px;
    align-items: center;
    width: 700px
`;



// const Price = styled(Chip)`
//   position: absolute;
//   margin: 5px;
//   font-weight: bold;
//   font-size: 1em !important;
// `;

// const BorderLinearProgress = styled(LinearProgress)`
//   margin: 20px 0;
//   height: 10px !important;
//   border-radius: 30px;
//   border: 2px solid white;
//   box-shadow: 5px 5px 40px 5px rgba(0,0,0,0.5);
//   background-color:var(--main-text-color) !important;
  
//   > div.MuiLinearProgress-barColorPrimary{
//     background-color:var(--title-text-color) !important;
//   }

//   > div.MuiLinearProgress-bar1Determinate {
//     border-radius: 30px !important;
//     background-image: linear-gradient(270deg, rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.5));
//   }
// `;

// const ShimmerTitle = styled.h1`
//   margin: 50px auto;
//   text-transform: uppercase;
//   animation: glow 2s ease-in-out infinite alternate;
//   color: var(--main-text-color);
//   @keyframes glow {
//     from {
//       text-shadow: 0 0 20px var(--main-text-color);
//     }
//     to {
//       text-shadow: 0 0 30px var(--title-text-color), 0 0 10px var(--title-text-color);
//     }
//   }
// `;


// const GoldTitle = styled.h2`
//   color: var(--title-text-color);
//   font-family: 'Roboto Serif', sans-serif;
// `;

// const LogoAligner = styled.div`
//   display: flex;
//   align-items: center;

//   img {
//     max-height: 35px;
//     margin-right: 10px;
//   }
// `;

const ProgressBar = styled.div`
    width: 100%;
    height: 30px;
    background-color: #dedede;
    border-radius:12px;
    font-weight: 600;
    font-size: .8rem;
    overflow: hidden;
`;

interface ITest{
    width: number,
} 

const Progress = styled.div`
    width: ${(props:ITest) => props.width}%; 
    height: 30px;
    padding: 0;
    text-align: center;
    background-color: skyblue;
    color: #111;
    transition-duration: 1s;
    `

export interface HomeProps {
    candyMachineId: anchor.web3.PublicKey;
    connection: anchor.web3.Connection;
    txTimeout: number;
    rpcHost: string;
}

const Home = (props: HomeProps) => {
    const [balance, setBalance] = useState<number>();
    const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT
    const [isActive, setIsActive] = useState(false); // true when countdown completes or whitelisted
    const [solanaExplorerLink, setSolanaExplorerLink] = useState<string>("");
    const [itemsAvailable, setItemsAvailable] = useState(0);
    const [itemsRedeemed, setItemsRedeemed] = useState(0);
    const [itemsRemaining, setItemsRemaining] = useState(0);
    const [isSoldOut, setIsSoldOut] = useState(false);
    const [payWithSplToken, setPayWithSplToken] = useState(false);
    const [price, setPrice] = useState(0);
    const [priceLabel, setPriceLabel] = useState<string>("SOL");
    const [whitelistPrice, setWhitelistPrice] = useState(0);
    const [whitelistEnabled, setWhitelistEnabled] = useState(false);
    const [whitelistTokenBalance, setWhitelistTokenBalance] = useState(0);
    const [isWhitelist, setIsWhitelist] = useState<boolean>(false);  //whitelist에 있는가?
    const [isMinted, setIsMinted] = useState<boolean>(true); // minting을 했는가?
    const [selected,setSelected] = useState<number>(1); // minting 개수 설정
    const [isWallet,setIsWallet] = useState<boolean>(false);
    const [walletId,setWalletId] = useState<number>(0);
    const [alertState, setAlertState] = useState<AlertState>({
        open: false,
        message: "",
        severity: undefined,
    });

    const wallet = useAnchorWallet();
    const [candyMachine, setCandyMachine] = useState<CandyMachine>();

    const rpcUrl = props.rpcHost;


    // const updateIsMinted = () => {
    //     Axios.post("http://localhost:8000/isminted", {}).then(() => {
    //         alert("DB에 지갑 주소에 맞게 isminted 0에서 1로 변경 완료");
    //     });
    // }
      async function updateIsMinted(){
        try{
          const response = await Axios({
            url: 'http://localhost:8000/isminted',
            method : 'POST',
            data : {
                    walletId : walletId
                    }  
            });
        console.log(response.data);
        }
        catch(error){
        console.log(error);
        }
    };

      async function chkDB() {
        try {
          const response = await Axios({
            url: 'http://localhost:8000/chkwhitelist',
            method : 'POST',
            data : {
                walletAddress : wallet.publicKey.toString()
            }
        });
          console.log(response.data);
          if(response.data.length){
            console.log("화이트리스트 대상자가 맞습니다.");
            setIsWhitelist(true);
            if(response.data[0].isminted){
                console.log("이미 민팅을 하였습니다.");
                setIsMinted(true);
            }
            else{
                console.log("민팅을 하지 않았습니다.");
                setIsMinted(false);
            }
            setWalletId(response.data[0].id);
            console.log(response.data[0].id);
            }
          else{
            console.log("화이트리스트 대상자가 아닙니다.");
            setIsWhitelist(false);      
          }
          alert("DB에 화이트리스트가 있는가?");

        } catch (error) {
          console.error(error)
        }
      }



      const refreshCandyMachineState = () => {
        (async () => {
            if (!wallet) return

            chkDB();

            const cndy = await getCandyMachineState(
                wallet as anchor.Wallet,
                props.candyMachineId,
                props.connection
            );

            setCandyMachine(cndy);
            setItemsAvailable(cndy.state.itemsAvailable);
            setItemsRemaining(cndy.state.itemsRemaining);
            setItemsRedeemed(cndy.state.itemsRedeemed);

            var divider = 1;
            if (decimals) {
                divider = +('1' + new Array(decimals).join('0').slice() + '0');
            }

            // detect if using spl-token to mint
            if (cndy.state.tokenMint) {
                setPayWithSplToken(true);
                // Customize your SPL-TOKEN Label HERE
                // TODO: get spl-token metadata name
                setPriceLabel(splTokenName);
                setPrice(cndy.state.price.toNumber() / divider);
                setWhitelistPrice(cndy.state.price.toNumber() / divider);
            }else {
                setPrice(cndy.state.price.toNumber() / LAMPORTS_PER_SOL);
                setWhitelistPrice(cndy.state.price.toNumber() / LAMPORTS_PER_SOL);
            }


            // fetch whitelist token balance
            if (cndy.state.whitelistMintSettings) {
                setWhitelistEnabled(true);
                if (cndy.state.whitelistMintSettings.discountPrice !== null && cndy.state.whitelistMintSettings.discountPrice !== cndy.state.price) {
                    if (cndy.state.tokenMint) {
                        setWhitelistPrice(cndy.state.whitelistMintSettings.discountPrice?.toNumber() / divider);
                    } else {
                        setWhitelistPrice(cndy.state.whitelistMintSettings.discountPrice?.toNumber() / LAMPORTS_PER_SOL);
                    }
                }
                let balance = 0;
                try {
                    const tokenBalance =
                        await props.connection.getTokenAccountBalance(
                            (
                                await getAtaForMint(
                                    cndy.state.whitelistMintSettings.mint,
                                    wallet.publicKey,
                                )
                            )[0],
                        );

                    balance = tokenBalance?.value?.uiAmount || 0;
                    
                } 
                
                catch (e) {
                    console.error(e);
                    balance = 0;
                }
                setWhitelistTokenBalance(balance);
                setIsActive(balance > 0);
            } else {
                setWhitelistEnabled(false);
            }
        })();
    };

    const renderCounter = ({days, hours, minutes, seconds}: any) => {
        return (
            <div><Card elevation={1}><h1>{days}</h1><br/>Days</Card><Card elevation={1}><h1>{hours}</h1>
                <br/>Hours</Card><Card elevation={1}><h1>{minutes}</h1><br/>Mins</Card><Card elevation={1}>
                <h1>{seconds}</h1><br/>Secs</Card></div>
        );
    };

    function displaySuccess(mintPublicKey: any): void {
        let remaining = itemsRemaining - 1;
        setItemsRemaining(remaining);
        setIsSoldOut(remaining === 0);
        if (whitelistTokenBalance && whitelistTokenBalance > 0) {
            let balance = whitelistTokenBalance - 1;
            setWhitelistTokenBalance(balance);
            setIsActive(balance > 0);
        }
        setItemsRedeemed(itemsRedeemed + 2);
        const solFeesEstimation = 0.012; // approx
        if (!payWithSplToken && balance && balance > 0) {
            setBalance(balance - (whitelistEnabled ? whitelistPrice : price) - solFeesEstimation);
        }
        setSolanaExplorerLink(cluster === "devnet" || cluster === "testnet"
            ? ("https://explorer.solana.com/address/" + mintPublicKey + "?cluster=" + cluster)
            : ("https://explorer.solana.com/address/" + mintPublicKey));
        throwConfetti();
    };

    function displaySuccess_2(): void {
        let remaining = itemsRemaining - selected;
        setItemsRemaining(remaining);
        setIsSoldOut(remaining === 0);
        if (whitelistTokenBalance && whitelistTokenBalance > 0) {
            let balance = whitelistTokenBalance - 1;
            setWhitelistTokenBalance(balance);
            setIsActive(balance > 0);
        }
        setItemsRedeemed(itemsRedeemed + selected);
        const solFeesEstimation = 0.012; // approx
        if (!payWithSplToken && balance && balance > 0) {
            setBalance(balance - (whitelistEnabled ? whitelistPrice : price) - solFeesEstimation);
        }
        throwConfetti();
    };
    
    function throwConfetti(): void {
        confetti({
            particleCount: 400,
            spread: 70,
            origin: {y: 0.6},
        });
    }
    

    // const onMint = async () => {
    //     try {
    //         setIsMinting(true);
    //         if (wallet && candyMachine?.program && wallet.publicKey) {
    //             const mint = anchor.web3.Keypair.generate();
    //             const mintTxId = (
    //                 await mintOneToken(candyMachine, wallet.publicKey, mint)
    //             )[0];

    //             let status: any = {err: true};
    //             if (mintTxId) {
    //                 status = await awaitTransactionSignatureConfirmation(
    //                     mintTxId,
    //                     props.txTimeout,
    //                     props.connection,
    //                     'singleGossip',
    //                     true,
    //                 );
    //             }

    //             if (!status?.err) {
    //                 setAlertState({
    //                     open: true,
    //                     message: 'Congratulations! Mint succeeded!',
    //                     severity: 'success',
    //                 });

    //                 // update front-end amounts
    //                 displaySuccess(mint.publicKey);
    //             } else {
    //                 setAlertState({
    //                     open: true,
    //                     message: 'Mint failed! Please try again!',
    //                     severity: 'error',
    //                 });
    //             }
    //         }
    //     } catch (error: any) {
    //         // TODO: blech:
    //         let message = error.msg || 'Minting failed! Please try again!';
    //         if (!error.msg) {
    //             if (!error.message) {
    //                 message = 'Transaction Timeout! Please try again.';
    //             } else if (error.message.indexOf('0x138')) {
    //             } else if (error.message.indexOf('0x137')) {
    //                 message = `SOLD OUT!`;
    //             } else if (error.message.indexOf('0x135')) {
    //                 message = `Insufficient funds to mint. Please fund your wallet.`;
    //             }
    //         } else {
    //             if (error.code === 311) {
    //                 message = `SOLD OUT!`;
    //             } else if (error.code === 312) {
    //                 message = `Minting period hasn't started yet.`;
    //             }
    //         }

    //         setAlertState({
    //             open: true,
    //             message,
    //             severity: "error",
    //         });
    //     } finally {
    //         setIsMinting(false);
    //     }
    // };

    const onMint_1 = async () => {
        try {
            setIsMinting(true);
            if (wallet && candyMachine?.program && wallet.publicKey) {
                const mintTxId: any = (
                    await mintOneToken_2(candyMachine, wallet.publicKey, selected)
                );

                const promiseArray = [];

                for (let index = 0; index < mintTxId.length; index++) {
                    promiseArray.push(
                        awaitTransactionSignatureConfirmation(
                            mintTxId[index],
                            props.txTimeout,
                            props.connection,
                            'singleGossip',
                            true
                            )
                        );
                }

                const allTransactionsResult = await Promise.all(promiseArray);
                let totalSuccess = 0;
                let totalFailure = 0;
                for (let index = 0; index < allTransactionsResult.length; index++) {
                    const transactionStatus = allTransactionsResult[index];
                    if (!transactionStatus?.err) {
                        totalSuccess += 1;
                    } else {
                        totalFailure += 1;
                    }
                }
                if (totalSuccess) {
                    setAlertState({
                        open: true,
                        message: `Congratulations! ${totalSuccess} mints succeeded!`,
                        severity: 'success',
                    });
                    // update front-end amounts
                    displaySuccess_2();
                    updateIsMinted();
                    chkDB();
                }

                if (totalFailure) {
                    setAlertState({
                        open: true,
                        message: `Some mints failed! ${totalFailure} mints failed!`,
                        severity: 'error',
                    });
                    // update front-end amounts
                    displaySuccess_2();
                }

            }
        } catch (error: any) {
            // TODO: blech:
            let message = error.msg || 'Minting failed! Please try again!';
            if (!error.msg) {
                if (!error.message) {
                    message = 'Transaction Timeout! Please try again.';
                } else if (error.message.indexOf('0x138')) {
                } else if (error.message.indexOf('0x137')) {
                    message = `SOLD OUT!`;
                } else if (error.message.indexOf('0x135')) {
                    message = `Insufficient funds to mint. Please fund your wallet.`;
                }
            } else {
                if (error.code === 311) {
                    message = `SOLD OUT!`;
                } else if (error.code === 312) {
                    message = `Minting period hasn't started yet.`;
                }
            }

            setAlertState({
                open: true,
                message,
                severity: "error",
            });
        } finally {
            setIsMinting(false);
        }
    };

    useEffect(() => {
        (async () => {
            if (wallet) {
                const balance = await props.connection.getBalance(wallet.publicKey);
                setBalance(balance / LAMPORTS_PER_SOL); 
            }
        })();
    }, [wallet, props.connection]);

    useEffect(refreshCandyMachineState, [
        wallet,
        props.candyMachineId,
        props.connection
    ]);

    function Header(){
    return(
    <div id="header">
        <nav className="navbar">
            <div className="navbar_logo">
                <a href="adrress"> <img src="logo.jpg" alt="Logo" style={{height:'55px'}}/> </a>
            </div>
            <div className="navbar2">
                <ul className="navbar_icons">
                    <li><a href="https://twitter.com/MoonsnailsNFT" rel="noreferrer" target="_blank"><FaTwitter/></a></li>
                    <li><a href="https://solsea.io/" rel="noreferrer" target="_blank"><FaShoppingCart/></a></li>
                </ul>    
                <Wallet>
                    {wallet ?
                    <WalletAmount>{(balance || 0).toLocaleString()} sol<ConnectButton2/></WalletAmount> :
                    <ConnectButton>Connect wallet</ConnectButton>}
                </Wallet>
            </div>
        </nav>
    </div>) 
    }
    
    const Counter = () => {
        const onIncrease = () => {
            if (selected < 2){
                setSelected(cnt => cnt + 1);
            }
        };
        const onDecrease = () => {
            if (selected > 1){
                setSelected(cnt => cnt - 1);
            }
        };

        return(
            <div className='counterContainer'>
                <StyledButton variant="contained" onClick={onDecrease}>-</StyledButton>
                <StyledButton variant='contained' disabled>{selected}</StyledButton>
                <StyledButton variant="contained" onClick = {onIncrease}>+</StyledButton>
            </div>
        )

    };  
    useEffect(()=>{
        if(wallet&&isActive){
            setIsWallet(true);
        }
        else{setIsWallet(false);
        }}
    ,[wallet,isActive]);

    return (
        <main>
            <div className="big_wrap" >
            <Header></Header>
            <MainContainer>
                <TextContainer isWallet={isWallet}>
                        <Text>
                            <h1>MoonSnails NFT</h1>
                        </Text>
                        <Text1>
                            <h3>MoonSnails nft's vision is to build an inclusive web3 through its collection and community. 
                                We will mint in August 2022. You woukd choose max 2 NFTs We can create opportunities for anyone around the world
                                to be owners.</h3>
                        </Text1>
                    
                        {wallet && isActive &&
                        /* <p>Total Minted : {100 - (itemsRemaining * 100 / itemsAvailable)}%</p>}*/
                        <div>
                            {/* <h3>Total Minted : {itemsAvailable}</h3> */}
                            <ProgressBar>
                                <Progress width = {100-(itemsRemaining*100/itemsAvailable)}/>
                            </ProgressBar>
                                
                            <h3>Minting Progress : {100-(itemsRemaining*100/itemsAvailable)}%</h3>
                            <Counter/>
                        </div>
                        }
                        
                        {!isActive && candyMachine?.state.goLiveDate ? (
                            <Countdown
                                date={toDate(candyMachine?.state.goLiveDate)}
                                onMount={({completed}) => completed && setIsActive(true)}
                                onComplete={() => {
                                    setIsActive(true);
                                }}
                                renderer={renderCounter}
                            />) : (
                            !wallet ? (
                                    <ConnectButton3><Text2></Text2></ConnectButton3>
                                ) :
                                //민트버튼 위치
                                candyMachine?.state.gatekeeper &&
                                wallet.publicKey &&
                                wallet.signTransaction ? (
                                    <GatewayProvider
                                        wallet={{
                                            publicKey:
                                                wallet.publicKey ||
                                                new PublicKey(CANDY_MACHINE_PROGRAM),
                                            //@ts-ignore
                                            signTransaction: wallet.signTransaction,
                                        }}
                                        // // Replace with following when added
                                        // gatekeeperNetwork={candyMachine.state.gatekeeper_network}
                                        gatekeeperNetwork={
                                            candyMachine?.state?.gatekeeper?.gatekeeperNetwork
                                        } // This is the ignite (captcha) network
                                        /// Don't need this for mainnet
                                        clusterUrl={rpcUrl}
                                        options={{autoShowModal: false}}
                                    >
                                        <MintButton
                                            candyMachine={candyMachine}
                                            isMinting={isMinting}
                                            isActive={isActive}
                                            isSoldOut={isSoldOut}
                                            onMint={onMint_1}
                                            isWhitelist={isWhitelist}
                                            isMinted={isMinted}
                                        />
                                    </GatewayProvider>
                                ) : (
                                    <MintButtonContainer>
                                    <MintButton
                                        candyMachine={candyMachine}
                                        isMinting={isMinting}
                                        isActive={isActive}
                                        isSoldOut={isSoldOut}
                                        onMint={onMint_1}
                                        isWhitelist={isWhitelist}
                                        isMinted={isMinted}
                                    />
                                    </MintButtonContainer>
                                ))}
                </TextContainer>
                <DesContainer>
                    <Slider/>
                </DesContainer>
            </MainContainer>
            <Snackbar
                open={alertState.open}
                autoHideDuration={6000}
                onClose={() => setAlertState({...alertState, open: false})}
            >
                <Alert
                    onClose={() => setAlertState({...alertState, open: false})}
                    severity={alertState.severity}
                >
                    {alertState.message}
                </Alert>
            </Snackbar>
            </div>
        </main>
    );
};

export default Home;

