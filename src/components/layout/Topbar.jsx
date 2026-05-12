import React from "react";
import { Search, Bell, Menu, ChevronDown } from "lucide-react";
import {
  TopbarWrapper,
  LeftActions,
  MenuButton,
  SearchBox,
  SearchInput,
  Actions,
  IconButton,
  UserProfile,
  Avatar,
  UserText,
  UserName,
  UserRole,
} from "../ui/Topbar.styles";

function Topbar({ onOpenSidebar }) {
  return (
    <TopbarWrapper>
      <LeftActions>
        <MenuButton type="button" onClick={onOpenSidebar}>
          <Menu size={22} />
        </MenuButton>
      </LeftActions>

      <Actions>
        <SearchBox>
          <Search size={17} />
          <SearchInput placeholder="Buscar productos, clientes, ventas..." />
        </SearchBox>

        <IconButton type="button">
          <Bell size={18} />
        </IconButton>

        <UserProfile>
          <Avatar />
          <UserText>
            <UserName>Carlos</UserName>
            <UserRole>Administrador</UserRole>
          </UserText>
          <ChevronDown size={16} />
        </UserProfile>
      </Actions>
    </TopbarWrapper>
  );
}

export default Topbar;
