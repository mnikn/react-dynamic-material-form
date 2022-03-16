import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Grid, IconButton, Stack } from '@mui/material';
import get from 'lodash/get';
import {
  SchemaField,
  SchemaFieldArray,
  SchemaFieldBoolean,
  SchemaFieldNumber,
  SchemaFieldObject,
  SchemaFieldSelect,
  SchemaFieldString,
  SchemaFieldType,
} from '../../models/schema';
import React, { useEffect, useState } from 'react';
import { generateUUID } from '../../utils/uuid';
import { CollapseCard } from '../CollapseCard/CollapseCard';
import { BooleanField } from '../BooleanField/BooleanField';
import { NumberField } from '../NumberField/NumberField';
import { SelectField } from '../SelectField/SelectField';
import { StringField } from '../StringField/StringField';

export const FieldWrapper = ({
  schema,
  value,
  onValueChange,
  currentLang,
  config,
}: {
  schema: SchemaField;
  value: any;
  onValueChange?: (value: any) => void;
  currentLang?: string;
  config: {
    i18n: string[];
  };
}) => {
  if (schema.type === SchemaFieldType.Object) {
    const objectValueChange = (v: any, id: string) => {
      if (onValueChange) {
        onValueChange({
          ...value,
          [id]: v,
        });
      }
    };

    return (
      <Grid container spacing={{ xs: 2, md: 2 }}>
        {(schema as SchemaFieldObject).fields.map((item) => {
          if (item.data.config.enableWhen) {
            const fn = eval(item.data.config.enableWhen);
            if (!fn(value)) {
              return null;
            }
          }
          if (item.data.type === SchemaFieldType.Number) {
            return (
              <Grid item xs={item.data.config.colSpan} key={item.id}>
                <NumberField
                  label={item.name || item.id}
                  value={value[item.id]}
                  schema={item.data as SchemaFieldNumber}
                  onValueChange={(v) => objectValueChange(v, item.id)}
                />
              </Grid>
            );
          } else if (item.data.type === SchemaFieldType.String) {
            return (
              <Grid item xs={item.data.config.colSpan} key={item.id}>
                <StringField
                  label={item.name || item.id}
                  schema={item.data as SchemaFieldString}
                  value={value[item.id]}
                  config={config}
                  onValueChange={(v) => objectValueChange(v, item.id)}
                />
              </Grid>
            );
          } else if (item.data.type === SchemaFieldType.Boolean) {
            return (
              <Grid item xs={item.data.config.colSpan} key={item.id}>
                <BooleanField
                  label={item.name || item.id}
                  schema={item.data as SchemaFieldBoolean}
                  value={value[item.id]}
                  onValueChange={(v) => objectValueChange(v, item.id)}
                />
              </Grid>
            );
          } else if (item.data.type === SchemaFieldType.Select) {
            return (
              <Grid item xs={item.data.config.colSpan} key={item.id}>
                <SelectField
                  label={item.name || item.id}
                  schema={item.data as SchemaFieldSelect}
                  value={value[item.id]}
                  onValueChange={(v) => objectValueChange(v, item.id)}
                />
              </Grid>
            );
          } else if (item.data.type === SchemaFieldType.Object) {
            const summary = item.data.config.summary.replace(/\{\{[A-Za-z0-9_.\[\]]+\}\}/g, (all: any) => {
              const word = all.substring(2, all.length - 2);
              if (word === '___key') {
                return item.name;
              }
              const v = get(value[item.id], word, '');
              if (typeof v === 'object') {
                return v[currentLang || ''];
              }
              return v;
            });
            return (
              <Grid item xs={item.data.config.colSpan} key={item.id}>
                <CollapseCard title={summary} initialExpand={item.data.config.initialExpand}>
                  <FieldWrapper
                    schema={item.data || item.id}
                    value={value[item.id]}
                    config={config}
                    onValueChange={(v) => objectValueChange(v, item.id)}
                  />
                </CollapseCard>
              </Grid>
            );
          } else if (item.data.type === SchemaFieldType.Array) {
            return (
              <FieldArray
                key={item.id}
                label={item.name || item.id}
                schema={item.data as SchemaFieldArray}
                value={value[item.id]}
                config={config}
                onValueChange={(v) => objectValueChange(v, item.id)}
              />
            );
          }
          return null;
        })}
      </Grid>
    );
  } else if (schema.type === SchemaFieldType.String) {
    return (
      <Grid item xs={schema.config.colSpan}>
        <StringField
          schema={schema as SchemaFieldString}
          value={value}
          config={config}
          onValueChange={(v) => {
            if (onValueChange) {
              onValueChange(v);
            }
          }}
        />
      </Grid>
    );
  } else if (schema.type === SchemaFieldType.Number) {
    return (
      <Grid item xs={schema.config.colSpan}>
        <NumberField
          schema={schema as SchemaFieldNumber}
          value={value}
          onValueChange={(v) => {
            if (onValueChange) {
              onValueChange(v);
            }
          }}
        />
      </Grid>
    );
  } else if (schema.type === SchemaFieldType.Select) {
    return (
      <Grid item xs={schema.config.colSpan}>
        <SelectField
          schema={schema as SchemaFieldSelect}
          value={value}
          onValueChange={(v) => {
            if (onValueChange) {
              onValueChange(v);
            }
          }}
        />
      </Grid>
    );
  } else if (schema.type === SchemaFieldType.Boolean) {
    return (
      <Grid item xs={schema.config.colSpan}>
        <BooleanField
          schema={schema as SchemaFieldBoolean}
          value={value}
          onValueChange={(v) => {
            if (onValueChange) {
              onValueChange(v);
            }
          }}
        />
      </Grid>
    );
  }
  return null;
};

export const FieldArray = ({
  label,
  schema,
  value,
  config,
  onValueChange,
}: {
  label?: string;
  schema: SchemaFieldArray;
  value: any[];
  onValueChange?: (value: any) => void;
  config: {
    i18n: string[];
  };
}) => {
  const [list, setList] = useState<any[]>(
    value.map((item) => {
      return {
        id: generateUUID(),
        value: item,
      };
    }),
  );

  const addItem = () => {
    setList((prev) => {
      return prev.concat({
        id: generateUUID(),
        value: schema.fieldSchema.config.defaultValue,
      });
    });
  };

  const moveUpItem = (sourceIndex: number) => {
    setList((prev) => {
      const targetIndex = Math.max(sourceIndex - 1, 0);
      return prev.map((item, j) => {
        if (j === sourceIndex) {
          return prev[targetIndex];
        }
        if (j === targetIndex) {
          return prev[sourceIndex];
        }
        return item;
      }, []);
    });
  };
  const moveDownItem = (sourceIndex: number) => {
    setList((prev) => {
      const targetIndex = Math.min(sourceIndex + 1, prev.length - 1);
      return prev.map((item, j) => {
        if (j === sourceIndex) {
          return prev[targetIndex];
        }
        if (j === targetIndex) {
          return prev[sourceIndex];
        }
        return item;
      }, []);
    });
  };
  const deleteItem = (i: number) => {
    setList((prev) => {
      return prev.filter((_, j) => j !== i);
    });
  };

  useEffect(() => {
    if (onValueChange) {
      onValueChange(list.map((item) => item.value));
    }
  }, [list]);

  const onItemChange = (v: any, i: number) => {
    setList((prev) => {
      return prev.map((item, j) => (j === i ? { id: item.id, value: v } : item));
    });
  };

  return (
    <Grid item xs={schema.config.colSpan}>
      <CollapseCard title={label || ''} initialExpand={schema.config.initialExpand}>
        <Stack spacing={1}>
          {list.map((item, i) => {
            return (
              <Stack key={item.id} spacing={1} direction="row" style={{ width: '100%', alignItems: 'center' }}>
                <Stack spacing="2" direction="row" sx={{ flexGrow: 1 }}>
                  <CollapseCard title={`# ${i + 1}`} initialExpand={schema.config.initialExpand}>
                    <FieldWrapper
                      schema={schema.fieldSchema as SchemaField}
                      value={item.value}
                      config={config}
                      onValueChange={(v) => onItemChange(v, i)}
                    />
                  </CollapseCard>
                  <IconButton component="span" onClick={() => moveUpItem(i)}>
                    <ArrowUpwardIcon />
                  </IconButton>
                  <IconButton component="span" onClick={() => moveDownItem(i)}>
                    <ArrowDownwardIcon />
                  </IconButton>
                  <IconButton component="span" onClick={() => deleteItem(i)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Stack>
            );
          })}
          <Button variant="contained" onClick={addItem}>
            Add Item
          </Button>
        </Stack>
      </CollapseCard>
    </Grid>
  );
};
