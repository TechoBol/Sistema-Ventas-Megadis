import { useState, useEffect } from "react";
import styled from "styled-components";
import Popover from "@mui/material/Popover";
import { useProduct } from "../../hooks/useProduct";

// ── Estilos propios ──────────────────────────────────────────
export const BranchPopoverCard = styled.div`
  min-width: 280px;
  width: 280px;
  background: linear-gradient(180deg, #fff1f2 0%, #ffe4e6 100%);
  border-radius: 20px;
  border: 1px solid rgba(239, 68, 68, 0.32);
  box-shadow:
    0 20px 45px rgba(15, 23, 42, 0.18),
    0 8px 24px rgba(239, 68, 68, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  padding: 20px 20px 16px;
`;

export const BranchPopoverTitle = styled.h4`
  margin: 0 0 16px;
  font-size: 20px;
  font-weight: 800;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: "";
    width: 10px;
    height: 26px;
    border-radius: 999px;
    background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);
    box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);
  }
`;

export const BranchPopoverTable = styled.div`
  width: 100%;
`;

export const BranchPopoverHead = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  padding: 10px 12px;
  margin-bottom: 4px;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.12);
  font-size: 13px;
  font-weight: 800;
  color: #334155;

  span:last-child {
    text-align: right;
  }
`;

export const BranchPopoverRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  padding: 12px;
  border-bottom: 1px solid rgba(203, 213, 225, 0.7);
  font-size: 14px;
  color: #0f172a;

  span:last-child {
    text-align: right;
    font-weight: 600;
  }

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.45);
    border-radius: 10px;
  }
`;
