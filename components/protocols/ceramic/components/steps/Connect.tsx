import {Col, Alert, Space, Typography, Button, Modal} from 'antd';
import {LinkOutlined} from '@ant-design/icons';
import {useEffect, useState} from 'react';
import {
  getChainInnerState,
  getCurrentChainId,
  getCurrentStepIdForCurrentChain,
  useGlobalState,
} from 'context';
import detectEthereumProvider from '@metamask/detect-provider';
import {PROTOCOL_INNER_STATES_ID} from 'types';
import SetupWizard from 'components/shared/SetupWizard';

const {Text} = Typography;

declare let window: {
  ethereum: {
    enable: () => Promise<string[]>;
  };
};

const Connect = () => {
  const {state, dispatch} = useGlobalState();
  const chainId = getCurrentChainId(state);
  const stepId = getCurrentStepIdForCurrentChain(state);

  const [address, setAddress] = useState<string | undefined>(undefined);

  const ethereumAddress = getChainInnerState(
    state,
    chainId,
    PROTOCOL_INNER_STATES_ID.ADDRESS,
  );

  useEffect(() => {
    if (address) {
      dispatch({
        type: 'SetStepInnerState',
        chainId,
        innerStateId: PROTOCOL_INNER_STATES_ID.ADDRESS,
        value: address,
      });
      dispatch({
        type: 'SetStepIsCompleted',
        chainId,
        stepId,
        value: true,
      });
    }
  }, [address]);

  const checkConnection = async () => {
    try {
      const provider = await detectEthereumProvider();

      if (provider) {
        // Connect to Ethereum using Web3Provider and Metamask
        // Define address and network
        const addresses = undefined;
        const address = undefined;

        setAddress(address);
      } else {
        alert('Please install Metamask at https://metamask.io');
      }
    } catch (error) {
      alert('Something went wrong');
    }
  };

  return (
    <Col style={{minHeight: '350px', maxWidth: '600px'}}>
      <Space direction="vertical" size="large">
        <Space direction="vertical" size="large">
          <>
            <Button
              type="primary"
              icon={<LinkOutlined />}
              onClick={checkConnection}
              size="large"
            >
              Check Metamask Connection
            </Button>
            {ethereumAddress ? (
              <>
                <Alert
                  message={<Text strong>Connected to MetaMask 😍</Text>}
                  description={
                    <Space direction="vertical">
                      <Text>Your Ethereum Address is:</Text>
                      <Text code>{ethereumAddress}</Text>
                    </Space>
                  }
                  type="success"
                  showIcon
                  onClick={checkConnection}
                />
                <SetupWizard />
              </>
            ) : (
              <Alert
                message="Not connected to MetaMask"
                type="error"
                showIcon
              />
            )}
          </>
        </Space>
      </Space>
    </Col>
  );
};

export default Connect;