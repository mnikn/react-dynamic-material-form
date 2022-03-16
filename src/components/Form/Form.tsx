import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  CssBaseline,
  GlobalStyles,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import throttle from 'lodash/throttle';
import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { SchemaFieldObject, validateValue } from '../../models/schema';
import { generateUUID } from '../../utils/uuid';
import { FieldWrapper } from '../FieldWrapper/FieldWrapper';

const ExpandMore = styled((props: any) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  marginRight: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const grid = 6;

const HIDDEN_ID = '$$__index';

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : '#e7ebf0',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? 'lightblue' : '#e7ebf0',
  padding: grid,
  width: 250,
});

const Item = ({
  schema,
  value,
  index,
  onValueChange,
  onDuplicate,
  onDelete,
  schemaConfig,
  currentLang,
  sx,
}: {
  schema: SchemaFieldObject;
  schemaConfig: any;
  value: any;
  onValueChange?: (v: any) => void;
  index: number;
  onDuplicate: () => void;
  onDelete: () => void;
  currentLang?: string;
  sx?: any;
}) => {
  const [expanded, setExpanded] = useState<boolean>((schema as SchemaFieldObject).config.initialExpand);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const settingsMenuOpen = Boolean(anchorEl);
  const handleExpandClick = () => {
    setExpanded((prev) => {
      return !prev;
    });
  };
  const handleSettingsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setAnchorEl(null);
  };

  const summary = schema.config.summary.replace(/\{\{[A-Za-z0-9_.\[\]]+\}\}/g, (all: any) => {
    const item = all.substring(2, all.length - 2);
    if (item === '___index') {
      return index;
    }
    const v = get(value, item, '');
    if (typeof v === 'object') {
      return v[currentLang || ''];
    }
    return v;
  });

  return (
    <Card sx={sx}>
      <CardHeader
        subheader={summary}
        action={
          <>
            <IconButton aria-label="settings" onClick={handleSettingsClick}>
              <MoreVertIcon />
            </IconButton>
            <ExpandMore expand={expanded} onClick={handleExpandClick}>
              <ExpandMoreIcon />
            </ExpandMore>
          </>
        }
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <FieldWrapper schema={schema} value={value} onValueChange={onValueChange} config={schemaConfig} />
        </CardContent>
      </Collapse>
      <Menu
        id="settings-menu"
        anchorEl={anchorEl}
        open={settingsMenuOpen}
        onClose={handleSettingsClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem
          onClick={() => {
            onDuplicate();
            handleSettingsClose();
          }}
        >
          Duplicate
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDelete();
            handleSettingsClose();
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
};

export interface FormAPI {
  submmit: () => any;
}

export interface FromProps {
  value: any[];
  schemaConfig: {
    i18n: string[];
    summary: string;
    schema: SchemaFieldObject;
  };
}

const FormCore = ({ schemaConfig, value }: FromProps, ref: any) => {
  const [valueList, setActualValueList] = useState<any[]>([]);
  const [displayValueList, setDisplayValueList] = useState<any[]>([]);
  const [currentLang, setCurrentLang] = useState<string>('');
  const [schema, setSchema] = useState<SchemaFieldObject | null>(null);

  const setValueListRef = useRef(throttle((newValue) => setActualValueList(newValue), 1000));
  const setValueList = setValueListRef.current;

  useEffect(() => {
    setDisplayValueList(valueList);
  }, [valueList]);

  const submit = useCallback(() => {
    return valueList;
  }, [valueList]);
  useImperativeHandle(
    ref,
    () => {
      return {
        submit,
      };
    },
    [submit],
  );

  useEffect(() => {
    if (!schema) {
      return;
    }
    const formatData = value.map((item) => {
      return validateValue(item, item, schema, schemaConfig);
    });
    const finalData = formatData.map((item) => {
      item[HIDDEN_ID] = generateUUID();
      return item;
    }, []);
    setValueList(finalData);
  }, [value, schema, schemaConfig]);

  const onItemChange = (v: any, i: number) => {
    setValueList((prev: any) => {
      return prev.map((item: any, j: number) => (j === i ? v : item));
    });
  };
  const onItemDelete = (i: number) => {
    setValueList((prev: any) => {
      return prev.filter((_: any, j: number) => j !== i);
    });
  };
  const onItemDuplicate = (i: number) => {
    setValueList((prev: any) => {
      const v = cloneDeep(prev[i]);
      v[HIDDEN_ID] = generateUUID();
      prev.splice(i, 0, v);
      return [...prev];
    });
  };

  const addItem = useCallback(() => {
    if (!schema) {
      return;
    }
    setValueList((prevArr: any) => {
      const v = cloneDeep(schema.configDefaultValue);
      v[HIDDEN_ID] = generateUUID();
      console.log(prevArr, v);
      return prevArr.concat(v);
    });
  }, [schema]);

  useEffect(() => {
    if (schemaConfig) {
      /* setSchema(buildSchema(schemaConfig.schema)); */
      setSchema(schemaConfig.schema);
      if (schemaConfig.i18n.length > 0) {
        setCurrentLang(schemaConfig.i18n[0]);
      }
    }
  }, [schemaConfig]);

  /* const onFilterChange = (filterVal) => {
   *   setDisplayValueList(
   *     valueList.filter((item) => {
   *       const needFilter = Object.keys(filterVal).reduce((res, prop) => {
   *         if (!res) {
   *           return res;
   *         }
   *         if (!filterVal[prop].value) {
   *           return res;
   *         }

   *         if (filterVal[prop].type === 'string') {
   *           return get(item, prop).includes(filterVal[prop].value);
   *         }
   *         return get(item, prop) === filterVal[prop].value;
   *       }, true);
   *       return needFilter;
   *     })
   *   );
   * }; */

  return (
    <div
      style={{
        backgroundColor: '#e7ebf0',
        padding: '20px',
      }}
    >
      <CssBaseline enableColorScheme />
      <GlobalStyles
        styles={{
          scrollBaseColor: 'rgba(0, 0, 0, 0)',

          /* webkit */
          '*::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '*::-webkit-scrollbar-corner': {
            backgroundColor: 'transparent',
          },

          /* firefox */
          scrollbarWidth: 'thin',
          scrollbarFaceColor: '#cccccc',
          scrollbarShadowColor: '#cccccc',
          scrollbarArrowColor: '#cccccc',
          scrollbarHighlightColor: '#cccccc',
          scrollbarDarkshadowColor: '#cccccc',
          scrollbarTrackColor: 'rgb(245, 245, 245)',
          /* firefox */
          scrollbarColor: '#e8e8e8 rgba(0, 0, 0, 0)',
          /* webkit */
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#5c5c5c',
            borderRadius: '3px',
          },
        }}
      />
      <Stack>
        <Stack spacing={2} direction="row-reverse">
          {schemaConfig.i18n.length > 0 && (
            <Select
              labelId="i18n-select-label"
              id="i18n-select"
              value={currentLang}
              label="I18n"
              onChange={(e) => setCurrentLang(e.target.value)}
              size="small"
              sx={{ backgroundColor: '#fff' }}
            >
              {schemaConfig.i18n.map((item2: any, j: number) => {
                return (
                  <MenuItem key={j} value={item2}>
                    {item2}
                  </MenuItem>
                );
              })}
            </Select>
          )}
        </Stack>

        <DragDropContext
          onDragEnd={(e: any) => {
            const final = displayValueList.map((item, j) => {
              if (j === e.source?.index) {
                return displayValueList[e.destination?.index];
              }
              if (j === e.destination?.index) {
                return displayValueList[e.source?.index];
              }
              return item;
            }, []);
            setValueList(final);
          }}
        >
          <Droppable droppableId="droppable">
            {(provided: any, snapshot: any) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  ...getListStyle(snapshot.isDraggingOver),
                  ...{ width: '100%' },
                }}
              >
                {displayValueList.map((item, i) => {
                  const key = String(item[HIDDEN_ID]);
                  return (
                    <Draggable key={key} draggableId={key} index={i}>
                      {(provided: any, snapshot: any) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                        >
                          <Stack
                            spacing={1}
                            direction="row"
                            style={{
                              width: '100%',
                              alignItems: 'center',
                            }}
                          >
                            <span {...provided.dragHandleProps}>
                              <DragIndicatorIcon />
                            </span>
                            <Item
                              sx={{ flexGrow: 1 }}
                              key={key}
                              index={i + 1}
                              schema={schema as SchemaFieldObject}
                              schemaConfig={schemaConfig}
                              value={displayValueList[i]}
                              onValueChange={(v) => onItemChange(v, i)}
                              onDuplicate={() => onItemDuplicate(i)}
                              onDelete={() => onItemDelete(i)}
                            />
                          </Stack>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Stack>

      <Button variant="contained" onClick={addItem} style={{ width: '100%' }}>
        Add Item
      </Button>
    </div>
  );
};

export const Form = React.forwardRef<FormAPI, FromProps>(FormCore);
