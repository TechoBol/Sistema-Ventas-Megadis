import { useState, useEffect } from "react";
import Popover from "@mui/material/Popover";
import {
    BranchPopoverCard,
    BranchPopoverTitle,
    BranchPopoverTable,
    BranchPopoverHead,
    BranchPopoverRow,
} from "../ui/BranchesPopover";
import { useProduct } from "../../hooks/useProduct";

export function BranchesPopover({ productId, anchorEl, onClose, currentLocationId }) {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(false);
    const { getStockByBranches } = useProduct();

    const open = Boolean(anchorEl);

    useEffect(() => {
        if (!open || !productId) return;
        setLoading(true);
        setBranches([]);
        getStockByBranches(productId)
            .then((data) => setBranches(
                data.branches?.filter((b) => b.stock > 0 && b.locationId !== currentLocationId) || []
            ))
            .finally(() => setLoading(false));
    }, [open, productId]);

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
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
            <BranchPopoverCard style={{ minWidth: "400px", width: "300px" }}>
                <BranchPopoverTitle>Stock por sucursal</BranchPopoverTitle>
                <BranchPopoverTable>
                    <BranchPopoverHead>
                        <span>SUCURSAL</span>
                        <span>STOCK</span>
                    </BranchPopoverHead>
                    {loading ? (
                        <BranchPopoverRow>
                            <span>Cargando...</span>
                        </BranchPopoverRow>
                    ) : branches.length === 0 ? (
                        <BranchPopoverRow>
                            <span>No hay stock disponible</span>
                        </BranchPopoverRow>
                    ) : (
                        branches.map((b) => (
                            <BranchPopoverRow key={b.locationId}>
                                <span>{b.locationName}</span>
                                <span>{b.stock}</span>
                            </BranchPopoverRow>
                        ))
                    )}
                </BranchPopoverTable>
            </BranchPopoverCard>
        </Popover>
    );
}