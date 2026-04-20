"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import ConsentCheckbox from "@/components/ConsentCheckbox";
import { testConfig } from "@/config/testConfig";
import { createEmptySession, setStimulusSet } from "@/lib/testLogic";
import { saveSession } from "@/lib/storage";

export default function InstructionsPage() {
  const router = useRouter();
  const [consent, setConsent] = useState(false);
  const [stimulusSet, setStimulusSetState] = useState ('set1');
  return (
    <main className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-sm sm:p-10">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Инструкция к тесту
            </h1>
          </div>

          <div className="space-y-4 text-slate-700">
            <p>Вам будут последовательно показаны <strong>{testConfig.rounds} серий</strong> из <strong>{testConfig.imagesPerRound} портретов</strong> каждая.</p>
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                Сначала в каждой серии выберите{" "}
                <strong>2 наиболее симпатичных для вас</strong> портрета, после чего нажмите клавишу внизу экрана.
              </li>
              <li>
                Затем выберите <strong>2 наиболее неприятных вам </strong> портрета и нажмите клавишу внизу экрана.
              </li>
              <li>
                После завершения всех выборов вы будете перенаправлены на итоговую страницу, где сможете увидеть и скачать свои ответы в обобщенной и детальной форме.
              </li>
            </ol>
			<p>По клавише ниже вы можете выбрать набор портретов - традиционный (Б.Энский) или современный (Н.Баналь)</p>
          </div>

          <div className="flex gap-3 flex-wrap">
           {testConfig.stimulusSets.map((set) => (
           <button
			      key={set.id}
            type="button"
            onClick={() => setStimulusSetState(set.id)}
				    className={`rounded-2xl px-5 py-3 text-sm font-semibold border ${
				    stimulusSet === set.id
				    ? "bg-slate-900 text-white border-slate-900"
				    : "border-slate-300 text-slate-700"
				    }`}
            >
				    {set.label}
			     </button>
    			))}
		      </div>

          <ConsentCheckbox checked={consent} onChange={setConsent} />

          <div className="flex flex-col gap-3 sm:flex-row">
          <button
     			type="button"
		    	disabled={!consent}
	    		onClick={() => {
    			let session = createEmptySession();
	    		session = setStimulusSet(session, stimulusSet);
		    	saveSession(session);
			    router.push("/test");
		    	}}
			    className={`inline-flex justify-center rounded-2xl px-6 py-4 text-base font-semibold ${
			    consent
		    	? "bg-slate-900 text-white"
		    	: "bg-slate-200 text-slate-500"
		    	}`}
		    	>
		    	Начать тест
			    </button>
          </div>
        </div>
      </div>
    </main>
  );
}