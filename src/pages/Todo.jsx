import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import "../../src/assets/styles/Todo.css";
import { BiMinus, BiCheckCircle } from "react-icons/bi";
import { Button } from "antd";
import Select from "react-select";

const Todo = () => {
  const [listUsername, setListUserName] = useState();
  const [userSelected, setUserSelected] = useState(null);
  const [listTask, setListTask] = useState();
  const [listTaskDone, setListTaskDone] = useState();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fetchData = () => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        setListUserName(res?.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {});
  };

  const getListTaskByUser = useCallback((id) => {
    axios
      .get(`https://jsonplaceholder.typicode.com/users/${id}/todos`)
      .then((res) => {
        const newData = res.data;
        newData.sort((x, y) => Number(x.completed) - Number(y.completed));
        const newListTaskDone = newData.filter((i) => i.completed);
        setListTask(res.data);
        setListTaskDone(newListTaskDone);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {});
  });

  useEffect(() => {
    if (userSelected) {
      getListTaskByUser(userSelected?.value);
    }
  }, [userSelected]);

  const updateUserMarkDone = useCallback(async (idTask) => {
    try {
      const { data } = await axios.patch(
        `https://jsonplaceholder.typicode.com/todos/${idTask}`,
        {
          completed: true,
        }
      );
      const newListTask = listTask?.map((itemTask, index) => {
        if (itemTask.id == data.id) {
          itemTask.completed = true;
          itemTask.loading = false;
        }
        return itemTask;
      });
      newListTask.sort((x, y) => Number(x.completed) - Number(y.completed));
      const newListTaskDone = newListTask.filter((i) => i.completed);
      setListTaskDone(newListTaskDone);
      setListTask(newListTask);
    } catch (error) {
      console.log("error", error);
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      User
      <br />
      <div
        style={{
          width: "300px",
        }}
      >
        <Select
          className="basic-single"
          classNamePrefix="select"
          defaultValue={null}
          name="color"
          options={listUsername?.map((i) => ({
            label: i.name,
            value: i.id,
          }))}
          onChange={(option) => {
            setUserSelected(option);
          }}
        />
      </div>
      <div>
        <div className="title-task">
          Task: <span className="crossbar"></span>{" "}
        </div>
        <div
          className="box-table"
          style={{
            maxHeight: "500px",
          }}
          cols="30"
          rows="10"
        >
          <div className="list-ds">
            {listTask?.length > 0 ? (
              <ul>
                {listTask?.map((itemTask, index) => {
                  let loading = itemTask?.loading || false;
                  return (
                    <li key={index}>
                      <div className="list-item">
                        {" "}
                        <span className="T-Check">
                          {itemTask?.completed == false ? (
                            <BiMinus className="icon-style" />
                          ) : (
                            <BiCheckCircle className="icon-style-check" />
                          )}
                        </span>
                        {itemTask?.title}
                      </div>
                      <span>
                        {itemTask?.completed == false && (
                          <Button
                            onClick={() => {
                              let newData = [...listTask];
                              newData[index].loading = true;
                              setListTask(newData);
                              updateUserMarkDone(itemTask?.id);
                            }}
                            type="primary"
                            loading={loading}
                          >
                            Mark Done
                          </Button>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
              
            ) : (
              "No data"
            )}
             <div>
          <span>
            {listTask && `${listTaskDone?.length}/${listTask?.length}`}
          </span>
        </div>
          </div>
        </div>
        
      </div>
     
    </div>
  );
};

export default Todo;
