import styled from "styled-components";

export const TopbarWrapper = styled.header`
  height: 64px;
  padding: 0 28px;
  background: #f7f7f3;

  display: flex;
  align-items: center;
  justify-content: space-between;

  position: sticky;
  top: 0;
  z-index: 10;

  @media (max-width: 768px) {
    height: 58px;
    padding: 0 16px;
  }
`;

export const LeftActions = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
`;

export const MenuButton = styled.button`
  display: none;

  @media (max-width: 900px) {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 12px;
    background: #ffffff;
    color: #0f172a;

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;
  }
`;

export const SearchBox = styled.div`
  width: 420px;
  height: 42px;
  padding: 0 16px;
  border-radius: 22px;
  background: #ffffff;
  color: #94a3b8;

  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 1100px) {
    width: 320px;
  }

  @media (max-width: 768px) {
    width: 42px;
    padding: 0;
    justify-content: center;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  background: transparent;

  font-size: 14px;
  color: #334155;

  &::placeholder {
    color: #94a3b8;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

export const IconButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #ffffff;
  color: #0f172a;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
`;

export const UserProfile = styled.button`
  border: none;
  background: transparent;
  padding: 0;

  display: flex;
  align-items: center;
  gap: 10px;

  cursor: pointer;

  @media (max-width: 600px) {
    gap: 6px;
  }
`;

export const Avatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #d9d9d9;
  flex: 0 0 auto;
`;

export const UserText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 600px) {
    display: none;
  }
`;

export const UserName = styled.p`
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
`;

export const UserRole = styled.span`
  font-size: 12px;
  color: #64748b;
`;
