import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Loading from "../components/common/Loading";
import PeripheralDeviceCard from "../components/PeripheralDeviceCard";
import custom_axios from "../utils/custom_axios";
import { PeripheralDevice } from "../entities/entities";
import toast from "../utils/toast";
let Container = styled.div`
  width: 100%;
`;

const endpoint = "/api/peripheral-devices";

export default function PeripheralDevicesView() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(new Array<PeripheralDevice>());
  useEffect(() => {
    custom_axios
      .get(endpoint)
      .then((res) => {
        console.log({ res });
        setData(res.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {loading && <Loading open={loading} />}
      {data.map((device) => (
        <PeripheralDeviceCard
          device={device}
          key={device._id}
          onEdit={(d: PeripheralDevice) => toast("" + d.uid)}
        />
      ))}
    </div>
  );
}
