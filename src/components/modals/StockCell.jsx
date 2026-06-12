import { useState } from "react";
import { Info } from "lucide-react";
import Popover from "@mui/material/Popover";
import {
  DetailPopoverCard,
  DetailPopoverHead,
  DetailPopoverRow,
  DetailPopoverTable,
  DetailPopoverTitle,
  PricePopoverHead,
  PricePopoverRow,
} from "../ui/Kardex";

export const StockCell = ({ stock, units }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <span>{Number(stock).toFixed(2)}</span>

        {units?.length > 1 && (
          <Info
            size={16}
            title="Ver presentaciones"
            style={{
              marginLeft: "auto",
              cursor: "pointer",
              color: "#64748b",
            }}
            onClick={handleOpen}
          />
        )}
      </div>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              borderRadius: "20px",
              boxShadow: "none",
              background: "transparent",
            },
          },
        }}
      >
        <DetailPopoverCard
          style={{
            minWidth: "250px",
            width: "250px",
          }}
        >
          <DetailPopoverTitle>Presentaciones</DetailPopoverTitle>

          <DetailPopoverTable>
            <PricePopoverHead>
              <span>UNIDAD</span>
              <span>STOCK</span>
            </PricePopoverHead>

            {units?.map((unit) => (
              <PricePopoverRow key={unit.id}>
                <span>{unit.unit.name}</span>
                <span>
                  {unit.equivalence > 0
                    ? (stock / unit.equivalence).toFixed(2)
                    : "-"}
                </span>
              </PricePopoverRow>
            ))}
          </DetailPopoverTable>
        </DetailPopoverCard>
      </Popover>
    </>
  );
};
