"use client";

import { useEffect, useState } from "react";
import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";

function getColumns(onImageClick: (url: string) => void): GridColDef[] {
  return [
    { field: "id", headerName: "ID", width: 70 },
    { field: "topic", headerName: "Topic", width: 130, editable: false },
    { field: "comment", headerName: "Comment", width: 130 },
    { field: "group_id", headerName: "Group ID", width: 200 },
    { field: "user_id", headerName: "User ID", width: 200 },
    {
      field: "image_url",
      headerName: "Image",
      width: 120,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="img"
          style={{
            width: 40,
            height: 40,
            objectFit: "cover",
            borderRadius: 4,
            cursor: "pointer",
          }}
          onClick={() => onImageClick(params.value)}
        />
      ),
    },
    { field: "image_name", headerName: "Image Name", width: 150 },
    { field: "createdAt", headerName: "Created At", width: 180 },
    { field: "updatedAt", headerName: "Updated At", width: 180 },
  ];
}
export default function DashboardTable() {
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editRow, setEditRow] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    fetch("https://bot.beger.app/api/all")
      .then((res) => res.json())
      .then((data) => setRows(data));
  }, []);

  const handleImageClick = (url: string) => {
    setImgUrl(url);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setImgUrl(null);
  };

  const handleRowDoubleClick = (params: any) => {
    setEditRow(params.row);
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (editRow) {
      try {
        await fetch("https://bot.beger.app/api/update-title", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editRow.id, newTitle: editTitle }),
        });
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === editRow.id ? { ...row, topic: editTitle } : row,
          ),
        );
      } catch (e) {
        // handle error if needed
      }
    }
    setEditDialogOpen(false);
    setEditRow(null);
  };

  return (
    <>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={getColumns(handleImageClick)}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableRowSelectionOnClick
          autoHeight
          getRowId={(row) => row.id}
          onRowDoubleClick={handleRowDoubleClick}
        />
      </Box>
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogContent>
          {imgUrl && (
            <img
              src={imgUrl}
              alt="preview"
              style={{ maxWidth: "100%", maxHeight: "80vh" }}
            />
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogContent sx={{ minWidth: 300 }}>
          <Autocomplete
            freeSolo
            options={[
              "qr code เสีย",
              "สแกนไม่ติด",
              "สินค้าไม่ร่วมโปรโมชั่น",
              "สินค้าเกินระยะเวลาโปรโมชั่น",
              "สินค้าเคยถูกส่งมาแล้ว",
            ]}
            value={editTitle}
            onInputChange={(_, newValue) => setEditTitle(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Title"
                fullWidth
                autoFocus
                sx={{ mb: 2 }}
              />
            )}
          />
          <Button variant="contained" onClick={handleEditSave} fullWidth>
            Save
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
