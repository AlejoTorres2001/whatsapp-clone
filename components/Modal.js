import { useEffect, useState } from "react";
import reactDom from "react-dom";
import styled from "styled-components";

const Modal = ({ show, onClose, children, title }) => {
    const [isBrowser, setIsBrowser] = useState(false);
  
    useEffect(() => {
      setIsBrowser(true);
    }, []);
  
    const handleCloseClick = (e) => {
      e.preventDefault();
      onClose();
    };
  
    const modalContent = show ? (
      <StyledModalOverlay>
        <StyledModal>
          <StyledModalHeader>
            <X  href="#" onClick={handleCloseClick}>
              x
            </X>
          </StyledModalHeader>
          {title && <StyledModalTitle>{title}</StyledModalTitle>}
          <StyledModalBody>{children}</StyledModalBody>
        </StyledModal>
      </StyledModalOverlay>
    ) : null;
  
    if (isBrowser) {
      return reactDom.createPortal(
        modalContent,
        document.getElementById("modal-root")
      );
    } else {
      return null;
    }
  };
  
  const StyledModalBody = styled.div`
    padding-top: 10px;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  const StyledModalHeader = styled.div`
    display: flex;
    justify-content: flex-end;
    font-size: 25px;
    
  `;
  
  const StyledModal = styled.div`
    background: white;
    width: 400px;
    height: 200px;
    border-radius: 15px;
    padding: 15px;
    font-size: 20px;
  `;
  const StyledModalOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.5);
  `;
  const StyledModalTitle = styled.div`display:flex;
  justify-content:center;
  align-items:center;`
  const X = styled.a`text-decoration: none; color: black;`;
  export default Modal;