import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Checkbox, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField } from "@mui/material";
import { Item } from "../styles";
import CommentIcon from '@mui/icons-material/Comment';

type result = {
  question: string,
  variants?: string[]
}
type replies = {
  quesId: string,
  answers: string
}



const Questionnaire = () => {
  const [dataResponse, setDataResponse] = useState<result[]>([]);
  const [answers, setAnswers] = useState<replies[]>([])

  const loadQuestions = useCallback(async () => {
    const resp = await axios.get("../data.json");
    setDataResponse(resp?.data?.result)

  }, []);

  useEffect(() => {
    loadQuestions();


  }, [loadQuestions]);

  const [checked, setChecked] = React.useState<string[]>([]);

  const handleToggle = (value: string, questionNo: number) => () => {
    const currentIndex = checked.indexOf(value);

    const newChecked = checked;

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
    answersHandler(checked, questionNo)
  };

  const answersHandler = (checkedList: string[], questionNo: number) => {
    const newArr = [...answers]
    const index = newArr.findIndex((el: any) => el?.quesId === `ques-${questionNo}`)
    if (index > -1) {
      newArr[index]['answers'] = checkedList.join("|")
    }
    else {
      newArr.push({ quesId: `ques-${questionNo}`, answers: checkedList.join("|") })
    }
    setAnswers(newArr)

  }
const renderListItems = (el: result, questionNo: number) => {
    return ((Array.isArray(el?.variants)) && <List sx={{ width: '100%', border: "5px solid white" }}>
      {el?.variants?.map((value) => {
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem
            key={value}
            secondaryAction={
              <IconButton edge="end" aria-label="comments">
                <CommentIcon />
              </IconButton>
            }
            disablePadding
          >
            <ListItemButton role={undefined} onClick={handleToggle(value, questionNo)} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"

                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value}`} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>)
  }

  const renderTextarea = (el: result, questionNo: number) => {


    return (<React.Fragment>
      {(el?.variants === undefined) && (<TextField
        multiline
        fullWidth
        onChange={(evt) => answersHandler([evt.target.value], questionNo)}
        maxRows={4}
        variant="filled"
      />)}
    </React.Fragment>)
  }

  const onClickHandler = () => {
    console.log(answers)
  }
  return (<Box sx={{ flexGrow: 1 }}>

    {dataResponse.map((el: result, i: number) => {
      return (

        <Grid sx={{ padding: "10px" }} key={i}>
          <Item key={i}>{el?.question}</Item>
          {renderListItems(el, i)}
          {renderTextarea(el, i)}

        </Grid>
      )
    })}
    <Button variant="outlined" onClick={() => onClickHandler()}>Submit</Button>
  </Box>);
};
export default Questionnaire;
