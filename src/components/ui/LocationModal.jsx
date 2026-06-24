import styled from "styled-components";
import { theme } from "./Theme";

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;

  background: rgba(15, 23, 42, 0.45);

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 24px;
  box-sizing: border-box;
`;

export const ModalCard = styled.div`
  width: 100%;
  max-width: ${({ $size }) => ($size === "large" ? "1100px" : "580px")};
  min-width: 280px;
  max-height: calc(100dvh - 48px);
  overflow-y: auto;

  background: ${theme.colors.background};
  border-radius: 20px;

  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.22);

  position: relative;
  overflow: hidden;

  @media (max-width: 700px) {
    border-radius: 16px;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  padding: 22px 28px 18px;
  border-bottom: 1px solid #f1f5f9;
`;

export const ModalHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ModalIconBadge = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(242, 12, 31, 0.08);

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  color: ${theme.colors.primary};
`;

export const ModalTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
`;

export const ModalSubtitle = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${theme.colors.textSecondary || "#64748b"};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 24px 28px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 11px;
  font-weight: 600;
  color: ${theme.colors.textSecondary || "#64748b"};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const InputIcon = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  color: #94a3b8;
  pointer-events: none;
`;

export const Input = styled.input`
  width: 100%;
  height: 40px;

  border: 1px solid #e2e8f0;
  border-radius: 10px;

  padding: 0 14px 0 ${({ $hasIcon }) => ($hasIcon ? "38px" : "14px")};
  box-sizing: border-box;

  background: ${theme.colors.background};

  font-size: 14px;
  color: ${theme.colors.text};

  outline: none;

  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  &::placeholder {
    color: ${theme.colors.textMuted || "#cbd5e1"};
  }

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(242, 12, 31, 0.08);
  }
`;

export const SelectWrapper = styled.div`
  position: relative;
`;

export const Select = styled.select`
  width: 100%;
  height: 40px;

  border: 1px solid #e2e8f0;
  border-radius: 10px;

  padding: 0 40px 0 38px;
  box-sizing: border-box;

  background: ${theme.colors.background};

  font-size: 14px;
  color: ${({ value }) =>
    value ? theme.colors.text : theme.colors.textMuted || "#cbd5e1"};

  outline: none;
  appearance: none;

  cursor: pointer;

  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(242, 12, 31, 0.08);
  }

  option {
    color: ${theme.colors.text};
    background: ${theme.colors.background};
  }

  option:disabled {
    color: #94a3b8;
  }
`;

export const SelectIconLeft = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  color: #94a3b8;
  pointer-events: none;
  z-index: 1;
`;

export const SelectIcon = styled.span`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  color: #64748b;
  pointer-events: none;
`;

export const FieldsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns || 2}, 1fr);
  gap: 18px 20px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const FullWidthField = styled.div`
  grid-column: 1 / -1;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;

  padding: 16px 28px 22px;
  border-top: 1px solid #f1f5f9;

  @media (max-width: 700px) {
    flex-direction: column-reverse;
  }
`;

export const CancelButton = styled.button`
  height: 40px;
  padding: 0 20px;

  border: 1px solid #e2e8f0;
  border-radius: 10px;

  background: transparent;
  color: ${theme.colors.textSecondary || "#64748b"};

  font-size: 14px;
  font-weight: 500;

  cursor: pointer;

  transition:
    background 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }

  @media (max-width: 700px) {
    width: 100%;
  }
`;

export const SaveButton = styled.button`
  height: 40px;
  padding: 0 22px;

  border: none;
  border-radius: 10px;

  background: ${theme.colors.primary};
  color: #fff;

  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.2px;

  cursor: pointer;

  display: inline-flex;
  align-items: center;
  gap: 7px;

  transition:
    opacity 0.18s ease,
    transform 0.18s ease;

  &:hover {
    opacity: 0.92;
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 700px) {
    width: 100%;
    justify-content: center;
  }
`;

export const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  flex-shrink: 0;

  border: 1px solid #e2e8f0;
  border-radius: 8px;

  background: transparent;
  color: ${theme.colors.textSecondary || "#64748b"};

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: background 0.15s ease;

  &:hover {
    background: #f1f5f9;
  }
`;

/* ── Estilos que no cambiaron (los demás modales los usan) ── */

export const FormSectionTitle = styled.h3`
  margin: 10px 0 0;
  font-size: 24px;
  font-weight: 600;
  color: ${theme.colors.textPrimary};

  @media (max-width: 700px) {
    font-size: 20px;
  }
`;

export const ModalHint = styled.p`
  margin: -8px 0 0;
  font-size: 13px;
  color: ${theme.colors.textSecondary};
`;

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 92px;

  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 14px;
  box-sizing: border-box;

  background: ${theme.colors.background};
  font-size: 14px;
  color: ${theme.colors.text};

  outline: none;
  resize: vertical;

  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  &::placeholder {
    color: ${theme.colors.textMuted || "#cbd5e1"};
  }

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(242, 12, 31, 0.08);
  }
`;

export const DynamicFieldHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const IconAddButton = styled.button`
  width: 34px;
  height: 34px;

  border: none;
  border-radius: 50%;

  background: rgba(242, 12, 31, 0.08);
  color: ${theme.colors.primary};

  display: inline-flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    background: rgba(242, 12, 31, 0.14);
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.96);
  }
`;

export const DynamicList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const DynamicRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: center;
`;

export const RemoveLineButton = styled.button`
  width: 34px;
  height: 34px;

  border: none;
  border-radius: 50%;

  background: #f3f4f6;
  color: ${theme.colors.textSecondary};

  display: inline-flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    background: #fff3f4;
    color: ${theme.colors.primary};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;